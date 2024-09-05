import type { DefaultFluentMethods } from './DefaultFluentMethods.ts';
import type { DetermineFluentMethodsType } from './DetermineFluentMethodsType.ts';
import type { FluentMethodsMap } from './FluentMethodsMap.ts';

export type DetermineEaCFluentMethods<
  T,
  K extends keyof T,
  TBuilderModel
> = DetermineFluentMethodsType<T, K> extends infer MethodType
  ? MethodType extends keyof FluentMethodsMap<T, K, TBuilderModel>
    ? FluentMethodsMap<T, K, TBuilderModel>[MethodType]
    : DefaultFluentMethods<T, K, TBuilderModel>
  : DefaultFluentMethods<T, K, TBuilderModel>;

// export type DetermineEaCFluentMethods<
//   T,
//   K extends keyof T,
//   TBuilderModel
// > = DetermineFluentMethodsType<T, K> extends infer MethodType
//   ? MethodType extends keyof FluentMethodsMap<T, K, TBuilderModel>
//     ? $FluentTagExtractValue<T[K], 'Methods', MethodType, 'generic'> extends [
//         never
//       ]
//       ? FluentMethodsMap<T, K, TBuilderModel>[MethodType]
//       : $FluentMethodsAddGeneric<
//           FluentMethodsMap<T, K, TBuilderModel>[MethodType],
//           T[K],
//           $FluentTagExtractValue<T[K], 'Methods', MethodType, 'generic'>,
//           TBuilderModel
//         >
//     : DefaultFluentMethods<T, K, TBuilderModel>
//   : DefaultFluentMethods<T, K, TBuilderModel>;

// TODO(mcgear): We need to more globally handle the $* properties, so that no matter what Methods they are on they are removed and added as their own stack of fluent APIs on the actual method.

// TODO(mcgear): Need to support a tag value for setting the a type which contains additional Builder Handler calls

// TODO(mcgear): This needs to be something else that is also globally handled... Need a base type inferer of sorts to handle '$' props and Generics... And possibly other things in the future
// export type EaCDetailsFluentMethods<T, K extends keyof T, TBuilderModel> = <
//   TDetails extends T[K] = T[K]
// >() => SelectFluentBuilder<$FluentTagStrip<T[K]>, TBuilderModel> &
//   SelectFluentMethods<$FluentTagStrip<TDetails>, TBuilderModel>;
