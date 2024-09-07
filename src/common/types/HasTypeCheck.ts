/**
 * `HasTypeCheck<T, U, MatchAll>` checks if a type `T` extends `U`.
 * If `MatchAll` is true, it checks if all types in a union extend `U`.
 * If `MatchAll` is false, it checks if at least one type in a union extends `U`.
 *
 * @template T - The source type to check.
 * @template U - The target type that `T` should extend.
 * @template MatchAll - A boolean controlling whether all union members should match (`true` for all, `false` for any).
 *
 * @example
 * // Match any: At least one type in the union must extend `U`
 * type UnionType = { a: string } | { b: number };
 * type Match = HasTypeCheck<UnionType, { a: string }, false>; // true (because one type matches)
 *
 * @example
 * // Match all: All types in the union must extend `U`
 * type MatchAll = HasTypeCheck<UnionType, { a: string }, true>; // false (not all match)
 */
export type HasTypeCheck<
  T,
  U,
  MatchAll extends boolean = false,
> = MatchAll extends true
  // Match All: Check if all types in the union extend U
  ? [T] extends [U] ? true
  : false
  // Match Any: Check if at least one type in the union extends U
  : T extends U ? true
  : false;
