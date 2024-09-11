import type { SelectFluentBuilder } from "./SelectFluentBuilder.ts";
import type { SelectFluentMethods } from "./SelectFluentMethods.ts";
import type { $FluentTagExtractValue } from "./tags/$FluentTagExtractValue.ts";
import type { $FluentTagLoadHandlers } from "./tags/$FluentTagLoadHandlers.ts";
import type { $FluentTagStrip } from "./tags/$FluentTagStrip.ts";

/**
 * Used for managing the property as it's value type.
 */
export type FluentMethodsProperty<
  T,
  K extends keyof T,
  TBuilderModel,
> = true extends $FluentTagExtractValue<T[K], "Methods", "generic">
  ? GenericMethod<T, K, TBuilderModel>
  : NonGenericMethod<T, K, TBuilderModel>;

type GenericMethod<T, K extends keyof T, TBuilderModel> = <
  TGeneric extends $FluentTagStrip<T[K]>,
>(
  input: TGeneric,
) =>
  & FluentMethodsPropertyReturnType<
    Omit<$FluentTagStrip<T>, K>,
    TBuilderModel
  >
  & $FluentTagLoadHandlers<T[K]>;

type NonGenericMethod<T, K extends keyof T, TBuilderModel> = (
  input: $FluentTagStrip<T[K]>,
) =>
  & FluentMethodsPropertyReturnType<
    Omit<$FluentTagStrip<T>, K>,
    TBuilderModel
  >
  & $FluentTagLoadHandlers<T[K]>;

export type FluentMethodsPropertyReturnType<T, TBuilderModel> =
  & SelectFluentBuilder<TBuilderModel>
  & SelectFluentMethods<T, TBuilderModel>;
