import type { DenoKVNonce } from "./DenoKVNonce.ts";

/**
 * Enqueues an atomic operation with a nonce and optional delay.
 *
 * @param op The Deno.AtomicOperation to enqueue the operation in.
 * @param msg The message to enqueue.
 * @param delay The delay (in milliseconds) before the operation is enqueued. Default is 0.
 * @returns The enqueued Deno.AtomicOperation.
 */
export function enqueueAtomicOperation(
  op: Deno.AtomicOperation,
  msg: DenoKVNonce,
  delay?: number,
): Deno.AtomicOperation {
  msg.nonce = crypto.randomUUID();

  op.check({ key: ["nonces", msg.nonce], versionstamp: null })
    .enqueue(msg, { delay })
    .set(["nonces", msg.nonce], true)
    .sum(["enqueued_count"], 1n);

  return op;
}
