import type { IsUndefined } from "./IsUndefined.ts";

/**
 * `IsNotUndefined<T>` checks whether a given type `T` is not strictly `undefined`.
 *
 * It acts as the inverse of `IsUndefined<T>` by returning `true` if the type `T` is anything other than `undefined`,
 * and returning `false` if `T` is `undefined`. This can be useful in contexts where you need to determine if a type
 * explicitly excludes `undefined`.
 *
 * This type is evaluated as:
 *
 * - `true` if `T` is **not** `undefined`
 * - `false` if `T` **is** `undefined` (including unions or intersections involving `undefined`)
 *
 * ### Key Features:
 * - Supports checking for both simple types (e.g., `string`, `number`) and more complex types (e.g., unions, intersections).
 * - Can be used to assert whether a type is defined, even when it's part of a union that includes `undefined`.
 * - Works with arrays, records, and complex objects.
 *
 * ### Usage Examples:
 *
 * ```typescript
 * type A = IsNotUndefined<string>; // true
 * type B = IsNotUndefined<undefined>; // false
 * type C = IsNotUndefined<string | undefined>; // false
 * type D = IsNotUndefined<Record<string, number>>; // true
 * type E = IsNotUndefined<Record<string, number | undefined>>; // false
 * ```
 *
 * @template T - The type to evaluate.
 * @returns `true` if `T` is not `undefined`, otherwise `false`.
 */
export type IsNotUndefined<T> = true extends IsUndefined<T> ? false : true;

