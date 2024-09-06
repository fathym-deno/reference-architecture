import type { ResolveIndexSignatures } from "./ResolveIndexSignatures.ts";

/**
 * Used to determine if an object has index signatures.
 */
export type HasIndexSignatures<T> = keyof ResolveIndexSignatures<T> extends [
  never,
] ? false
  : true;
