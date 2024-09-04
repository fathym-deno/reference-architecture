import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * The Fluent tag Methods type tag options.
 */
export type $FluentTagMethodsOptions = "Record" | "Object" | "Property";

/**
 * Map for looking up the Fluent tag type tag options, by tag type.
 */
export type $FluentTagOptions<TTagType extends $FluentTagTypeOptions> =
  TTagType extends "Methods" ? $FluentTagMethodsOptions : never;
