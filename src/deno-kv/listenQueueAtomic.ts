import type { AtomicOperationHandler } from "./AtomicOperationHandler.ts";
import type { DenoKVNonce } from "./DenoKVNonce.ts";

/**
 * Listen for a message in the queue and apply the atomic operation handler.
 *
 * @param queueKv The queue Deno.Kv instance.
 * @param msg The message with nonce and versionstamp.
 * @param atomicOpHandler The atomic operation handler.
 * @param opKv (optional) The operation Deno.Kv instance.
 * @returns A Deno.KvCommitResult or Deno.KvCommitError based on the atomic operation handler.
 */
export async function listenQueueAtomic(
  queueKv: Deno.Kv,
  msg: DenoKVNonce,
  atomicOpHandler: AtomicOperationHandler,
  opKv?: Deno.Kv,
): Promise<Deno.KvCommitResult | Deno.KvCommitError> {
  if (!msg.nonce) {
    throw new Error(`The message is required to have a nonce value.`);
  }

  if (!opKv) {
    opKv = queueKv;
  }

  const nonce = await queueKv.get<DenoKVNonce>(["nonces", msg.nonce]);

  let atomic = queueKv
    .atomic()
    .check({ key: nonce.key, versionstamp: nonce.versionstamp })
    .delete(nonce.key)
    .sum(["processed_count"], 1n);

  if (opKv !== queueKv) {
    const opAtomic = atomicOpHandler(opKv.atomic());

    await opAtomic.commit();
  } else {
    atomic = atomicOpHandler(atomic);
  }

  return await atomic.commit();
}
