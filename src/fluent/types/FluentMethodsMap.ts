import type { FluentMethodsObject } from "./FluentMethodsObject.ts";
import type { FluentMethodsProperty } from "./FluentMethodsProperty.ts";
import type { FluentMethodsRecord } from "./FluentMethodsRecord.ts";

/**
 * `FluentMethodsMap<T, K, TBuilderModel>` is a mapping of method types (Object, Property, Record)
 * to their corresponding method implementations.
 *
 * This type dynamically selects the appropriate method type based on the structure of `T`.
 *
 * ### Parameters:
 * - `T`: The input type containing the property `K`.
 * - `K`: The key within `T` that is mapped to a method type (Object, Property, Record).
 * - `TBuilderModel`: The builder model to which the methods are applied.
 *
 * The type is designed to handle various structures, including unions, by using the `T extends infer U`
 * pattern to better infer the correct method type when dealing with complex types like unions or intersections.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```ts
 * type Example = {
 *   prop: {
 *     name: string;
 *     details: {
 *       info: string;
 *     };
 *   };
 * };
 *
 * type Methods = FluentMethodsMap<Example, "prop", BuilderModel>;
 * // Result: Object | Property | Record methods based on the structure of "prop"
 * ```
 *
 * #### Handling Union Types:
 * ```ts
 * type UnionExample = {
 *   propA: {
 *     name: string;
 *   };
 * } | {
 *   propB: {
 *     info: number;
 *   };
 * };
 *
 * type Methods = FluentMethodsMap<UnionExample, keyof UnionExample, BuilderModel>;
 * // Result: Methods for both "propA" and "propB"
 * ```
 */
export type FluentMethodsMap<
  T,
  K extends keyof T,
  TBuilderModel,
> = T extends infer U ? K extends keyof U ? {
      Object: FluentMethodsObject<U, K, TBuilderModel>;
      Property: FluentMethodsProperty<U, K, TBuilderModel>;
      Record: FluentMethodsRecord<U, K, TBuilderModel>;
    }
  : never
  : never;
