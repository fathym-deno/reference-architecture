import type { AtomicOperationHandler } from "./AtomicOperationHandler.ts";
import type { DenoKVNonce } from "./DenoKVNonce.ts";
import { enqueueAtomicOperation } from "./enqueueAtomicOperation.ts";

/**
 * Enqueues an atomic operation and returns the result.
 *
 * @param queueKv The KV store for the queue.
 * @param msg The message to enqueue.
 * @param atomicOpHandler The atomic operation handler.
 * @param opKv The KV store for the operation.
 * @returns A promise that resolves to the commit result of the enqueue operation.
 */
export async function enqueueAtomic(
  queueKv: Deno.Kv,
  msg: DenoKVNonce,
  atomicOpHandler?: AtomicOperationHandler,
  opKv?: Deno.Kv,
): Promise<Deno.KvCommitResult | Deno.KvCommitError> {
  msg.nonce = crypto.randomUUID();

  if (!opKv) {
    opKv = queueKv;
  }

  let atomic = enqueueAtomicOperation(queueKv.atomic(), msg);

  if (atomicOpHandler) {
    if (opKv !== queueKv) {
      const opAtomic = atomicOpHandler(opKv.atomic());

      await opAtomic.commit();
    } else {
      atomic = atomicOpHandler(atomic);
    }
  }

  return await atomic.commit();
}
