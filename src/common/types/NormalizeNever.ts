/**
 * `NormalizeNever<T, Replacement>` converts `never` to `Replacement`, but leaves all other types unchanged.
 * It works for unions, intersections, and single types.
 *
 * @template T - The type to normalize.
 * @template Replacement - The type to replace `never` with (default is `false`).
 *
 * @example
 * type Example1 = NormalizeNever<never, false>; // false
 * type Example2 = NormalizeNever<string | never, false>; // string | false
 * type Example3 = NormalizeNever<string & never, false>; // false
 */
export type NormalizeNever<T, Replacement = false> = [T] extends [never]
  ? Replacement
  : T;
