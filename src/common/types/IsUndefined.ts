/**
 * `IsUndefined<T>` is a utility type that determines if a type `T` is `undefined`
 * or can possibly be `undefined`. It covers scenarios where `T` is explicitly `undefined`,
 * includes `undefined` in a union, or is an optional type.
 *
 * If `T` is a union or intersection, each member of the union or intersection is evaluated individually using the `infer U` pattern.
 * The utility also treats `never` as not `undefined`.
 *
 * @template T - The type to check for `undefined`.
 *
 * @example
 * // Directly undefined
 * type Example1 = IsUndefined<undefined>; // true
 *
 * @example
 * // Type that includes undefined in a union
 * type Example2 = IsUndefined<string | undefined>; // true
 *
 * @example
 * // Non-undefined type
 * type Example3 = IsUndefined<string>; // false
 *
 * @example
 * // Optional properties
 * type Example4 = IsUndefined<{ a?: string }["a"]>; // true
 */
export type IsUndefined<T> = [T] extends [never]
  ? [T] extends [undefined] ? true
  : false
  : [T] extends [undefined] // This handles intersections like string & undefined
    ? true
  : T extends infer U ? [U] extends [undefined] ? true
    : false
  : false;
