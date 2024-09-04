import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * The Fluent tag data key options.
 */
export type $FluentTagMethodsDataKeyOptions = "..." | "......";

/**
 * Map for looking up the Fluent tag data key options, by tag type
 */
export type $FluentTagDataKeyOptions<TType extends $FluentTagTypeOptions> =
  TType extends "Methods" ? $FluentTagMethodsDataKeyOptions : never;
