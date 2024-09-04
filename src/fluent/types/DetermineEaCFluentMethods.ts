import type { DefaultFluentMethods } from "./DefaultFluentMethods.ts";
import type { DetermineFluentMethodsType } from "./DetermineFluentMethodsType.ts";
import type { FluentMethodsMap } from "./FluentMethodsMap.ts";

export type DetermineEaCFluentMethods<
  T,
  K extends keyof T,
  TBuilderModel,
> = DetermineFluentMethodsType<T, K> extends infer MethodType
  ? MethodType extends keyof FluentMethodsMap<T, K, TBuilderModel>
    ? FluentMethodsMap<T, K, TBuilderModel>[MethodType]
  : DefaultFluentMethods<T, K, TBuilderModel>
  : DefaultFluentMethods<T, K, TBuilderModel>;
