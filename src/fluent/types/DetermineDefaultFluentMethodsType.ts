import type { ExtractExact, IsObject } from "../.deps.ts";
import type { $FluentTagMethodsOptions } from "./tags/$FluentTagOptions.ts";

/**
 * Determine the default method type based on conditions.
 *
 * export type DetermineDefaultFluentMethodType<T, K extends keyof T> = K extends "Details"
    ? ExtractExact<$FluentTagMethodsOptions, "Details">
    : IsObject<T[K]> extends true
        ? HasDetailsProperty<ValueType<ExcludeKeysByPrefix<T[K], "$">>> extends
            true ? ExtractExact<$FluentTagMethodsOptions, "Record">
        : ExtractExact<$FluentTagMethodsOptions, "Object">
    : ExtractExact<$FluentTagMethodsOptions, "Property">;
 */
export type DetermineDefaultFluentMethodsType<
  T,
  K extends keyof T,
> = true extends IsObject<T[K]>
  ? ExtractExact<$FluentTagMethodsOptions, "Object">
  : ExtractExact<$FluentTagMethodsOptions, "Property">;
