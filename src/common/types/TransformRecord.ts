// deno-lint-ignore-file no-explicit-any
import type { ExcludeIndexSignature } from "./ExcludeIndexSignature.ts";

/**
 * Used to transform a record to a new type by excluding an index signature.
 */
export type TransformRecord<T> = ExcludeIndexSignature<T> extends Record<
  any,
  infer U
> ? {
    [K in keyof ExcludeIndexSignature<T>]: U;
  }
  : never;
