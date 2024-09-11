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
import type { FluentMethodsProperty } from "./FluentMethodsProperty.ts";
import type { IsFluentRecord } from "./IsFluentRecord.ts";
import type { $FluentTagDeepStrip } from "./tags/$FluentTagDeepStrip.ts";

/**
 * Used for managing the property as an object, returning a fluent API for each of it's properties.
 */
export type FluentMethodsRecord<
  T,
  K extends keyof T,
  TBuilderModel,
> =
  & (RemoveIndexSignatures<T> extends infer U
    ? K extends keyof U
      ? true extends $FluentTagExtractValue<U[K], "Methods", "generic">
        ? GenericMethod<T, K, TBuilderModel>
      : NonGenericMethod<T, K, TBuilderModel>
    : true extends $FluentTagExtractValue<T[K], "Methods", "generic">
      ? GenericMethod<T, K, TBuilderModel>
    : NonGenericMethod<T, K, TBuilderModel>
    : never)
  & (ExtractKeysByPrefix<T[K], "$"> extends infer U
    ? SelectFluentMethods<U, TBuilderModel>
    : {})
  & $FluentTagLoadHandlers<T[K]>;

type NonGenericMethod<T, K extends keyof T, TBuilderModel> = (
  key: string,
  isRecord: true,
) =>
  & FluentMethodsRecordReturnType<T, K, ValueType<T[K]>, TBuilderModel>
  & $FluentTagLoadHandlers<ValueType<T[K]>>;

type GenericMethod<T, K extends keyof T, TBuilderModel> = <
  TGeneric extends $FluentTagDeepStrip<ValueType<T[K]>, "Methods">, // = ValueType<T[K]>
>(
  key: string,
  isRecord: true,
) =>
  & FluentMethodsRecordReturnType<T, K, TGeneric, TBuilderModel>
  & $FluentTagLoadHandlers<TGeneric>;

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
        //T[K]//FluentMethodsRecord<T[K], any, TBuilderModel>
      : SelectFluentMethods<TMethods, TBuilderModel>
      //true
    : SelectFluentMethods<TMethods, TBuilderModel>
    : string extends keyof T[K]
      ? FluentMethodsProperty<T[K], string, TBuilderModel>
    : never)
  & $FluentTagLoadHandlers<T[K]>; // SelectFluentMethods<TMethods, TBuilderModel> &
