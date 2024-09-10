// deno-lint-ignore-file ban-types
import type {
  ExtractKeysByPrefix,
  IsObjectNotNative,
  RemoveIndexSignatures,
  ValueType,
} from "../.deps.ts";
import type { SelectFluentBuilder } from "./SelectFluentBuilder.ts";
import type { SelectFluentMethods } from "./SelectFluentMethods.ts";
import type { $FluentTagExtractValue } from "./tags/$FluentTagExtractValue.ts";
import type { $FluentTagLoadHandlers } from "./tags/$FluentTagLoadHandlers.ts";
import type { $FluentTagStrip } from "./tags/$FluentTagStrip.ts";
import type { FluentMethodsProperty } from "./FluentMethodsProperty.ts";
import type { IsFluentRecord } from "./IsFluentRecord.ts";

/**
 * Used for managing the property as an object, returning a fluent API for each of it's properties.
 */
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
          isRecord: true,
        ) =>
          & FluentMethodsRecordReturnType<U, K, TGeneric, TBuilderModel>
          & $FluentTagLoadHandlers<TGeneric>
      : (
        key: string,
        isRecord: true,
      ) =>
        & FluentMethodsRecordReturnType<
          U,
          K,
          ValueType<U[K]>,
          TBuilderModel
        >
        & $FluentTagLoadHandlers<ValueType<U[K]>>
    : true extends $FluentTagExtractValue<T[K], "Methods", "generic">
      ? <TGeneric extends ValueType<T[K]> = ValueType<T[K]>>(
        key: string,
        isRecord: true,
      ) =>
        & FluentMethodsRecordReturnType<T, K, TGeneric, TBuilderModel>
        & $FluentTagLoadHandlers<TGeneric>
    : (
      key: string,
      isRecord: true,
    ) =>
      & FluentMethodsRecordReturnType<T, K, ValueType<T[K]>, TBuilderModel>
      & $FluentTagLoadHandlers<ValueType<T[K]>>
    : never)
  & (ExtractKeysByPrefix<T[K], "$"> extends infer U
    ? SelectFluentMethods<U, TBuilderModel>
    : {})
  & $FluentTagLoadHandlers<T[K]>;

// export type FluentMethodsRecordReturnType<
//   T,
//   K extends keyof T,
//   TMethods,
//   TBuilderModel
// > =
//   // SelectFluentBuilder<TBuilderModel> & SelectFluentMethods<T, TBuilderModel>;
//   keyof TMethods extends [never]
//     ? {}
//     : SelectFluentBuilder<TBuilderModel> &
//         (true extends IsObjectNotNative<TMethods>
//           ? DetermineFluentMethodsType<T, K> extends infer MethodType
//             ? MethodType extends ExtractExact<
//                 $FluentTagOptions<'Methods'>,
//                 'Object'
//               >
//               ? FluentMethodsObjectReturnType<TMethods, TBuilderModel>
//               : string //DetermineEaCFluentMethods<T[K], TMethods, TBuilderModel>
//             : false
//           : FluentMethodsPropertyReturnType<TMethods, TBuilderModel>);

type x = { [K in keyof RemoveIndexSignatures<Record<string, string>>]: true };

export type FluentMethodsRecordReturnType<
  T,
  K extends keyof T,
  TMethods,
  TBuilderModel,
> =
  & SelectFluentBuilder<TBuilderModel>
  & (true extends IsObjectNotNative<TMethods>
    ? true extends IsFluentRecord<TMethods>
      ? string extends keyof T[K]
        ? FluentMethodsRecord<T[K], string, TBuilderModel>
        // ? FluentMethodsRecordReturnType<
        //     TMethods,
        //     string,
        //     TMethods[string],
        //     TBuilderModel
        //   >
      : never
    : SelectFluentMethods<TMethods, TBuilderModel>
    : string extends keyof T[K]
      ? FluentMethodsProperty<T[K], string, TBuilderModel>
    : never)
  & // SelectFluentMethods<TMethods, TBuilderModel> &
  $FluentTagLoadHandlers<T[K]>;

export type FluentMethodsRecordReturnType2<
  T,
  K extends keyof T,
  TMethods,
  TBuilderModel,
> =
  & SelectFluentBuilder<TBuilderModel>
  & SelectFluentMethods<TMethods, TBuilderModel>
  & $FluentTagLoadHandlers<T[K]>;
