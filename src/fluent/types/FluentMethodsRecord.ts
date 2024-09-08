// deno-lint-ignore-file ban-types
import type { ExcludeKeysByPrefix } from "../../common/types/ExcludeKeysByPrefix.ts";
import type { ValueType } from "../../common/types/ValueType.ts";
import type { ExtractKeysByPrefix } from "../.deps.ts";
import type { SelectFluentBuilder } from "./SelectFluentBuilder.ts";
import type { SelectFluentMethods } from "./SelectFluentMethods.ts";
import type { $FluentTagExtractValue } from "./tags/$FluentTagExtractValue.ts";
import type { $FluentTagLoadHandlers } from "./tags/$FluentTagLoadHandlers.ts";
import type { $FluentTagStrip } from "./tags/$FluentTagStrip.ts";

/**
 * Used for managing the property as a Record<,> set where the root object property takes a key for the record, returning a fluent API for each of it's properties.
 */
export type FluentMethodsRecord<
  T,
  K extends keyof T,
  TBuilderModel,
> =
  & (true extends $FluentTagExtractValue<T[K], "Methods", "generic"> ? <
      TGeneric extends ValueType<
        ExcludeKeysByPrefix<$FluentTagStrip<T[K]>, "$">
      > = ValueType<ExcludeKeysByPrefix<$FluentTagStrip<T[K]>, "$">>,
    >(
      key: string,
    ) => FluentMethodsRecordReturnType<T, K, TGeneric, TBuilderModel>
    : (
      key: string,
    ) => FluentMethodsRecordReturnType<
      T,
      K,
      ValueType<ExcludeKeysByPrefix<$FluentTagStrip<T[K]>, "$">>,
      TBuilderModel
    >)
  & (ExtractKeysByPrefix<T[K], "$"> extends infer U
    ? SelectFluentMethods<U, TBuilderModel>
    : {});

type FluentMethodsRecordReturnType<
  T,
  K extends keyof T,
  TMethods,
  TBuilderModel,
> =
  & SelectFluentBuilder<
    ValueType<ExcludeKeysByPrefix<$FluentTagStrip<T[K]>, "$">>,
    TBuilderModel
  >
  // & SelectFluentMethods<$FluentTagStrip<TMethods>, TBuilderModel>
  & SelectFluentMethods<TMethods, TBuilderModel>
  & $FluentTagLoadHandlers<T, K>;
