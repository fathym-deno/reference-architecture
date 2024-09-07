import type { ResolveIndexSignatures } from "./ResolveIndexSignatures.ts";

/**
 * `HasIndexSignatures<T, MatchAll>` determines if an object `T` contains index signatures
 * (such as string, number, or symbol). It returns `true` if index signatures are present,
 * and `false` otherwise.
 *
 * The second argument `MatchAll` controls whether the check applies to all union members.
 * If `MatchAll` is `true`, it will return `true` only if all types in the union have
 * index signatures. If `MatchAll` is `false`, it will return `true` if at least one type
 * has index signatures.
 *
 * @template T - The source object type to check for index signatures.
 * @template MatchAll - A boolean controlling whether all types must match (`true` for all, `false` for any).
 *
 * @example
 * // Object with index signature
 * type WithIndexSignature = { [key: string]: any; id: number };
 * type HasIndex = HasIndexSignatures<WithIndexSignature, true>; // true
 *
 * @example
 * // Union of types with index signature and without index signature
 * type UnionType = { [key: string]: any } | { id: number };
 * type HasIndex = HasIndexSignatures<UnionType, false>; // true (because one has index signature)
 *
 * @example
 * // Union requiring all types to have index signatures
 * type HasIndexAll = HasIndexSignatures<UnionType, true>; // false (not all have index signatures)
 */
export type HasIndexSignatures<
  T,
  MatchAll extends boolean = false,
> = MatchAll extends true
  // Match all: All types in the union must have index signatures
  // deno-lint-ignore no-explicit-any
  ? [T] extends [any]
    // Wrap the evaluation in a tuple to prevent union distribution
    ? keyof ResolveIndexSignatures<T> extends [never] ? false
    : true
  : never
  // Match any: Return true if at least one union member has index signatures
  // deno-lint-ignore no-explicit-any
  : [T] extends [any] ? true extends (
      T extends unknown
        ? keyof ResolveIndexSignatures<T> extends [never] ? false
        : true
        : never
    ) ? true
    : false
  : false;
