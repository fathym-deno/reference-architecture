import type { ExcludeKeysByPrefix } from "../../common/types/ExcludeKeysByPrefix.ts";
import type { ValueType } from "../../common/types/ValueType.ts";
import type { SelectFluentBuilder } from "./SelectFluentBuilder.ts";
import type { SelectFluentMethods } from "./SelectFluentMethods.ts";
import type { $FluentTagStrip } from "./tags/$FluentTagStrip.ts";

/**
 * Used for managing the property as a Record<,> set where the root object property takes a key for the record, returning a fluent API for each of it's properties.
 */
// export type FluentMethodsRecord<T, K extends keyof T, TBuilderModel> = (
//   key: string
// ) => SelectFluentBuilder<
//   ValueType<ExcludeKeysByPrefix<T[K], '$'>>,
//   TBuilderModel
// > &
//   SelectFluentMethods<
//     ValueType<ExcludeKeysByPrefix<T[K], '$'>>,
//     TBuilderModel
//   >;
export type FluentMethodsRecord<T, K extends keyof T, TBuilderModel> = (
  key: string,
) =>
  & SelectFluentBuilder<
    ValueType<ExcludeKeysByPrefix<$FluentTagStrip<T[K]>, "$">>,
    TBuilderModel
  >
  & SelectFluentMethods<
    ValueType<ExcludeKeysByPrefix<$FluentTagStrip<T[K]>, "$">>,
    TBuilderModel
  >;

// TODO(mcgear): We need to more globally handle the $* properties, so that no matter what Methods they are on they are removed and added as their own stack of fluent APIs on the actual method.

// TODO(mcgear): Need to support a tag value for setting the a type which contains additional Builder Handler calls

// TODO(mcgear): This needs to be something else that is also globally handled... Need a base type inferer of sorts to handle '$' props and Generics... And possibly other things in the future
// export type EaCDetailsFluentMethods<T, K extends keyof T, TBuilderModel> = <
//   TDetails extends T[K] = T[K],
// >() =>
//   & SelectFluentBuilder<$FluentTagStrip<T[K]>, TBuilderModel>
//   & SelectFluentMethods<$FluentTagStrip<TDetails>, TBuilderModel>;
