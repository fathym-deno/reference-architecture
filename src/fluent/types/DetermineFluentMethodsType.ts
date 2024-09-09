import type { DetermineDefaultFluentMethodsType } from "./DetermineDefaultFluentMethodsType.ts";
import type { $FluentTagExtract } from "./tags/$FluentTagExtract.ts";

/**
 * `DetermineFluentMethodsType<T, K>` determines the Fluent Methods type by checking if a `FluentTag` has been assigned
 * to the property `T[K]`. If a `FluentTag` exists, it returns the extracted value for the `Methods` tag. If no tag exists,
 * it falls back to a default type based on the shape of `T[K]` using `DetermineDefaultFluentMethodsType`.
 *
 * ### Parameters:
 * - `T`: The object type containing the property `K`.
 * - `K`: The property key within `T` whose methods type is being determined.
 *
 * If a `FluentTag` is assigned to `T[K]`, the method will return the extracted tag value. Otherwise, it defaults to:
 * - `"Record"` if `T[K]` is an object or array with index signatures.
 * - `"Object"` if `T[K]` is a simple object.
 * - `"Property"` for primitive values or non-object types.
 *
 * ### Example Usage:
 *
 * ```ts
 * type ExampleType = {
 *   key: {
 *     "@Methods": "Record";
 *   };
 * };
 *
 * type MethodsType = DetermineFluentMethodsType<ExampleType, "key">;
 * // Result: "Record"
 * ```
 *
 * ### Fallback Example:
 * ```ts
 * type ExampleWithoutTag = {
 *   key: {
 *     someProperty: string;
 *   };
 * };
 *
 * type MethodsType = DetermineFluentMethodsType<ExampleWithoutTag, "key">;
 * // Result: "Object"
 * ```
 */
export type DetermineFluentMethodsType<
  T,
  K extends keyof T,
> = $FluentTagExtract<T[K], "Methods"> extends [never]
  ? DetermineDefaultFluentMethodsType<T, K>
  : $FluentTagExtract<T[K], "Methods">;
