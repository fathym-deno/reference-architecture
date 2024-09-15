// deno-lint-ignore-file ban-types
import type {
  HasKeys,
  NormalizeNever,
  RemoveIndexSignatures,
} from '../.deps.ts';
import type { FluentMethodsRecord } from './FluentMethodsRecord.ts';
import type { SelectFluentBuilder } from './SelectFluentBuilder.ts';
import type { SelectFluentMethodsForKeys } from './SelectFluentMethods.ts';
import type { $FluentTagExtractValue } from './tags/$FluentTagExtractValue.ts';
import type { $FluentTagLoadHandlers } from './tags/$FluentTagLoadHandlers.ts';
import type { $FluentTagStrip } from './tags/$FluentTagStrip.ts';

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
  TBuilderModel,
  Depth extends number
> = T extends infer U
  ? NormalizeNever<
      RemoveIndexSignatures<U> extends infer V
        ? true extends HasKeys<V>
          ? true extends $FluentTagExtractValue<V, 'Methods', 'generic'>
            ? FluentMethodsObjectGenericMethod<V, TBuilderModel, Depth>
            : FluentMethodsObjectNonGenericMethod<V, TBuilderModel, Depth>
          : {}
        : {},
      {}
    > &
      FluentMethodsRecord<U, TBuilderModel, Depth>
  : never;
// Handle $Props
//

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
export type FluentMethodsObjectGenericMethod<
  T,
  TBuilderModel,
  Depth extends number
> = <
  TGeneric extends T //$FluentTagDeepStrip<T, 'Methods'>
>() => FluentMethodsObjectReturnType<TGeneric, TBuilderModel, Depth>;

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
export type FluentMethodsObjectNonGenericMethod<
  T,
  TBuilderModel,
  Depth extends number
> = () => FluentMethodsObjectReturnType<T, TBuilderModel, Depth>;

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
export type FluentMethodsObjectReturnType<
  T,
  TBuilderModel,
  Depth extends number
> = SelectFluentBuilder<TBuilderModel> &
  SelectFluentMethodsForKeys<$FluentTagStrip<T>, TBuilderModel, Depth> &
  $FluentTagLoadHandlers<T>; //SelectFluentMethods<T, TBuilderModel, Depth>;
