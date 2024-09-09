// deno-lint-ignore-file ban-types
import type {
  ExtractKeysByPrefix,
  RemoveIndexSignatures,
  ValueType,
} from "../.deps.ts";
import type { SelectFluentBuilder } from "./SelectFluentBuilder.ts";
import type { SelectFluentMethods } from "./SelectFluentMethods.ts";
import type { $FluentTagExtractValue } from "./tags/$FluentTagExtractValue.ts";
import type { $FluentTagLoadHandlers } from "./tags/$FluentTagLoadHandlers.ts";
import type { $FluentTagStrip } from "./tags/$FluentTagStrip.ts";

/**
 * Used for managing the property as an object, returning a fluent API for each of it's properties.
 */
// export type FluentMethodsRecord<
//   T,
//   K extends keyof T,
//   TBuilderModel
// > = RemoveIndexSignatures<T> extends infer U
//   ? K extends keyof U
//     ? true extends $FluentTagExtractValue<U[K], 'Methods', 'generic'>
//       ? <
//           TGeneric extends ValueType<U[K]> = ValueType<U[K]>
//         >() => FluentMethodsRecordReturnType<U, K, TGeneric, TBuilderModel>
//       : () => FluentMethodsRecordReturnType<
//           U,
//           K,
//           ValueType<U[K]>,
//           TBuilderModel
//         >
//     : never
//   : T;

// export type FluentMethodsRecordReturnType<
//   T,
//   K extends keyof T,
//   TMethods,
//   TBuilderModel
// > = SelectFluentBuilder<
//   RemoveIndexSignatures<$FluentTagStrip<TMethods>>,
//   TBuilderModel
// > &
//   SelectFluentMethods<
//     RemoveIndexSignatures<$FluentTagStrip<TMethods>>,
//     TBuilderModel
//   > &
//   $FluentTagLoadHandlers<T, K>;

/**
 * Used for managing the property as a Record<,> set where the root object property takes a key for the record, returning a fluent API for each of it's properties.
 */
// export type FluentMethodsRecord<
//   T,
//   K extends keyof T,
//   TBuilderModel
// > = (RemoveIndexSignatures<$FluentTagStrip<T>> extends infer U
//   ? K extends keyof U
//     ? true extends $FluentTagExtractValue<U[K], 'Methods', 'generic'>
//       ? <
//           TGeneric extends ValueType<
//             ExcludeKeysByPrefix<$FluentTagStrip<U[K]>, '$'>
//           > = ValueType<ExcludeKeysByPrefix<$FluentTagStrip<U[K]>, '$'>>
//         >(
//           key: string
//         ) => FluentMethodsRecordReturnType<U, K, TGeneric, TBuilderModel>
//       : (
//           key: string
//         ) => FluentMethodsRecordReturnType<
//           U,
//           K,
//           ValueType<ExcludeKeysByPrefix<U[K], '$'>>,
//           TBuilderModel
//         >
//     : never
//   : T) &
//   (ExtractKeysByPrefix<T[K], '$'> extends infer U
//     ? SelectFluentMethods<U, TBuilderModel>
//     : {});
export type FluentMethodsRecord<
  T,
  K extends keyof T,
  TBuilderModel,
> =
  & (RemoveIndexSignatures<$FluentTagStrip<T>> extends infer U
    ? K extends keyof U
      ? true extends $FluentTagExtractValue<U[K], "Methods", "generic">
        ? <TGeneric extends ValueType<U[K]> = ValueType<U[K]>>(
          key: string,
        ) => FluentMethodsRecordReturnType<U, K, TGeneric, TBuilderModel>
      : (
        key: string,
      ) => FluentMethodsRecordReturnType<U, K, ValueType<U[K]>, TBuilderModel>
    : never
    : T)
  & (ExtractKeysByPrefix<T[K], "$"> extends infer U
    ? SelectFluentMethods<U, TBuilderModel>
    : {});

export type FluentMethodsRecordReturnType<
  T,
  K extends keyof T,
  TMethods,
  TBuilderModel,
> =
  & SelectFluentBuilder<
    RemoveIndexSignatures<$FluentTagStrip<TMethods>>,
    TBuilderModel
  >
  & SelectFluentMethods<$FluentTagStrip<TMethods>, TBuilderModel>
  & // SelectFluentMethods<TMethods, TBuilderModel> &
  $FluentTagLoadHandlers<T, K>;
