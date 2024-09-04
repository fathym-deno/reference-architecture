import { SelectFluentBuilder } from "./SelectFluentBuilder.ts";
import type { SelectFluentMethods } from "./SelectFluentMethods.ts";
import type { $FluentTagStrip } from "./tags/$FluentTagStrip.ts";

/**
 * Used for managing the property as an object, returning a fluent API for each of it's properties.
 */
export type FluentMethodsObject<
  T,
  K extends keyof T,
  TBuilderModel,
> = () =>
  & SelectFluentBuilder<$FluentTagStrip<T[K]>, TBuilderModel>
  & SelectFluentMethods<$FluentTagStrip<T[K]>, TBuilderModel>;
