import type { RemoveIndexSignatures } from "../.deps.ts";
import type { SelectFluentBuilder } from "./SelectFluentBuilder.ts";
import type { SelectFluentMethods } from "./SelectFluentMethods.ts";
import type { $FluentTagDeepStrip } from "./tags/$FluentTagDeepStrip.ts";
import type { $FluentTagExtractValue } from "./tags/$FluentTagExtractValue.ts";
import type { $FluentTagLoadHandlers } from "./tags/$FluentTagLoadHandlers.ts";
import type { $FluentTagStrip } from "./tags/$FluentTagStrip.ts";

/**
 * `FluentMethodsObject` manages an object property by returning a fluent API for each of its properties.
 *
 * ### Parameters:
 * - `T`: The target object that contains the property `K`.
 * - `K`: A key of `T` that represents the property.
 * - `TBuilderModel`: The fluent builder model associated with the property.
 *
 * This type returns methods for each property in the object.
 * If the property has a `generic` method defined in `$FluentTagExtractValue`, it returns the `GenericMethod`.
 * Otherwise, it returns the `NonGenericMethod`.
 *
 * ### Example Usage:
 *
 * #### Basic Usage:
 * ```ts
 * type Example = {
 *   key: {
 *     "@Methods-generic": true;
 *     someProp: string;
 *   };
 * };
 *
 * type FluentObject = FluentMethodsObject<Example, 'key', {}>;
 * ```
 *
 * #### Generic Method Example:
 * ```ts
 * type ExampleWithGeneric = {
 *   key: {
 *     "@Methods-generic": true;
 *     someProp: string;
 *   };
 * };
 *
 * type FluentGenericMethod = FluentMethodsObject<ExampleWithGeneric, 'key', {}>;
 * ```
 *
 * #### Non-Generic Method Example:
 * ```ts
 * type ExampleWithoutGeneric = {
 *   key: {
 *     someProp: string;
 *   };
 * };
 *
 * type FluentNonGenericMethod = FluentMethodsObject<ExampleWithoutGeneric, 'key', {}>;
 * ```
 */
export type FluentMethodsObject<
  T,
  K extends keyof T,
  TBuilderModel,
> = RemoveIndexSignatures<T> extends infer U
  ? K extends keyof U
    ? true extends $FluentTagExtractValue<U[K], "Methods", "generic">
      ? GenericMethod<T, K, TBuilderModel>
    : NonGenericMethod<T, K, TBuilderModel>
  : never
  : never;

/**
 * `GenericMethod` returns the fluent API for a generic method in an object property.
 *
 * ### Parameters:
 * - `T`: The target object.
 * - `K`: The key of the object to manage.
 * - `TBuilderModel`: The builder model for fluent API chaining.
 *
 * This method enables defining a generic method on the object and its properties.
 */
type GenericMethod<T, K extends keyof T, TBuilderModel> = <
  TGeneric extends $FluentTagDeepStrip<T[K], "Methods">,
>() =>
  & FluentMethodsObjectReturnType<
    RemoveIndexSignatures<TGeneric>,
    TBuilderModel
  >
  & $FluentTagLoadHandlers<T[K]>;

/**
 * `NonGenericMethod` returns the fluent API for a non-generic method in an object property.
 *
 * ### Parameters:
 * - `T`: The target object.
 * - `K`: The key of the object to manage.
 * - `TBuilderModel`: The builder model for fluent API chaining.
 *
 * This method enables returning non-generic methods for the object properties.
 */
type NonGenericMethod<
  T,
  K extends keyof T,
  TBuilderModel,
> = () =>
  & FluentMethodsObjectReturnType<
    RemoveIndexSignatures<$FluentTagStrip<T[K]>>,
    TBuilderModel
  >
  & $FluentTagLoadHandlers<T[K]>;

/**
 * `FluentMethodsObjectReturnType` returns a combination of the `SelectFluentBuilder`
 * and `SelectFluentMethods`, representing the available fluent methods and builder APIs.
 *
 * ### Parameters:
 * - `T`: The target type for which the methods are returned.
 * - `TBuilderModel`: The fluent builder model used for fluent chaining.
 *
 * This type provides access to fluent methods for object properties.
 */
export type FluentMethodsObjectReturnType<T, TBuilderModel> =
  & SelectFluentBuilder<TBuilderModel>
  & SelectFluentMethods<T, TBuilderModel>;
