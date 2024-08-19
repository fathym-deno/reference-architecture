/**
 * Used for chaining atomic operations.
 *
 * @param atomic The atomic operation to be chained.
 * @returns A new atomic operation that will be executed after the original one.
 */
export type AtomicOperationHandler = (
  atomic: Deno.AtomicOperation,
) => Deno.AtomicOperation;
