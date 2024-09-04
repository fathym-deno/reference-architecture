import type { FluentMethodsMap } from "./FluentMethodsMap.ts";

/**
 * The default Fluent Methods type.
 */
export type DefaultFluentMethods<
  T,
  K extends keyof T,
  TBuilderModel,
> = FluentMethodsMap<T, K, TBuilderModel>["Property"];
