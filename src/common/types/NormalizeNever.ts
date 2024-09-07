/**
 * `NormalizeNever<T>` converts `never` to `Replacement`, but leaves all other types unchanged.
 * It works for unions, intersections, and single types.
 *
 * @template T - The type to normalize.
 * @template Replacement - The type to replace `never` with (default is `false`).
 */
export type NormalizeNever<T, Replacement> = [T] extends [never] ? Replacement
  : T;
