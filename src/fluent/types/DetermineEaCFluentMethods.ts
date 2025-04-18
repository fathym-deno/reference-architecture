import type { DefaultFluentMethods } from "./DefaultFluentMethods.ts";
import type { DetermineFluentMethodsType } from "./DetermineFluentMethodsType.ts";
import type { FluentMethodsMap } from "./FluentMethodsMap.ts";

export type DetermineEaCFluentMethods<
  T,
  K extends keyof T,
  TBuilderModel,
> = T extends infer U
  ? K extends keyof U
    ? DetermineFluentMethodsType<U, K> extends infer MethodType
      ? MethodType extends keyof FluentMethodsMap<U, K, TBuilderModel>
        ? FluentMethodsMap<U, K, TBuilderModel>[MethodType]
      : DefaultFluentMethods<U, K, TBuilderModel>
    : DefaultFluentMethods<U, K, TBuilderModel>
  : never
  : T;

// export type DetermineEaCFluentMethods2<T, TBuilderModel> = T extends infer U
// ? DetermineFluentMethodsType2<U> extends infer MethodType
//   ? MethodType extends keyof FluentMethodsMap2<U, K, TBuilderModel>
//     ? FluentMethodsMap2<U, K, TBuilderModel>[MethodType]
//     : DefaultFluentMethods2<U, K, TBuilderModel>
//   : DefaultFluentMethods2<U, K, TBuilderModel>
// : never;
