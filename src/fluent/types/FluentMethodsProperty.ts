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
  ? <TGeneric extends T[K] = T[K]>(
    input: $FluentTagStrip<TGeneric>,
  ) => FluentMethodsPropertyReturnType<T, K, TBuilderModel>
  : (
    input: $FluentTagStrip<T[K]>,
  ) => FluentMethodsPropertyReturnType<T, K, TBuilderModel>;

type FluentMethodsPropertyReturnType<
  T,
  K extends keyof T,
  TBuilderModel,
> =
  & SelectFluentBuilder<$FluentTagStrip<T[K]>, TBuilderModel>
  & SelectFluentMethods<Omit<$FluentTagStrip<T>, K>, TBuilderModel>
  & $FluentTagLoadHandlers<T, K>;
