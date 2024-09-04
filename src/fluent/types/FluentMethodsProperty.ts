import type { SelectFluentBuilder } from "./SelectFluentBuilder.ts";
import type { SelectFluentMethods } from "./SelectFluentMethods.ts";
import type { $FluentTagStrip } from "./tags/$FluentTagStrip.ts";

/**
 * Used for managing the property as it's value type.
 */
export type FluentMethodsProperty<T, K extends keyof T, TBuilderModel> = (
  input: T[K],
) =>
  & SelectFluentBuilder<$FluentTagStrip<T[K]>, TBuilderModel>
  & SelectFluentMethods<Omit<$FluentTagStrip<T>, K>, TBuilderModel>;
