import type { ExtractExact, IsObject, ValueType } from "../.deps.ts";
import type { $FluentTagMethodsOptions } from "./tags/$FluentTagOptions.ts";

/**
 * Determine the default method type based on conditions.
 */
export type DetermineDefaultFluentMethodsType<
  T,
  K extends keyof T,
> = true extends IsObject<T[K]>
  ? true extends IsObject<ValueType<T[K]>>
    ? ExtractExact<$FluentTagMethodsOptions, "Record">
  : ExtractExact<$FluentTagMethodsOptions, "Object">
  : ExtractExact<$FluentTagMethodsOptions, "Property">;
