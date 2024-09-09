import type { RemoveIndexSignatures } from "../.deps.ts";
import type { SelectFluentBuilder } from "./SelectFluentBuilder.ts";
import type { SelectFluentMethods } from "./SelectFluentMethods.ts";
import type { $FluentTagExtractValue } from "./tags/$FluentTagExtractValue.ts";
import type { $FluentTagLoadHandlers } from "./tags/$FluentTagLoadHandlers.ts";
import type { $FluentTagStrip } from "./tags/$FluentTagStrip.ts";

/**
 * Used for managing the property as an object, returning a fluent API for each of it's properties.
 */
export type FluentMethodsObject<
  T,
  K extends keyof T,
  TBuilderModel,
> = RemoveIndexSignatures<T> extends infer U
  ? K extends keyof U
    ? true extends $FluentTagExtractValue<U[K], "Methods", "generic">
      ? <TGeneric extends U[K] = U[K]>() => FluentMethodsObjectReturnType<
        U,
        K,
        TGeneric,
        TBuilderModel
      >
    : () => FluentMethodsObjectReturnType<U, K, U[K], TBuilderModel>
  : never
  : T;

export type FluentMethodsObjectReturnType<
  T,
  K extends keyof T,
  TMethods,
  TBuilderModel,
> =
  & SelectFluentBuilder<
    RemoveIndexSignatures<$FluentTagStrip<T[K]>>,
    TBuilderModel
  >
  & SelectFluentMethods<
    RemoveIndexSignatures<$FluentTagStrip<TMethods>>,
    TBuilderModel
  >
  & $FluentTagLoadHandlers<T, K>;
