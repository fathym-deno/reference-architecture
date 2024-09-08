import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * `$FluentTagMethodsOptions` provides specific options for the `"Methods"` tag type.
 *
 * These options represent different types of metadata that can be tagged for method operations.
 *
 * ### Options:
 * - `"Record"`: Tag for records.
 * - `"Object"`: Tag for objects.
 * - `"Property"`: Tag for properties.
 */
export type $FluentTagMethodsOptions = "Record" | "Object" | "Property";

/**
 * `$FluentTagOptions<TTagType>` maps the provided tag type to its corresponding tag options.
 *
 * This type enables different Fluent tag types to have their own sets of valid tag options.
 * For example, for the `"Methods"` tag type, the available options are `"Record"`, `"Object"`, and `"Property"`.
 *
 * ### Parameters:
 * - `TTagType`: The base tag type, such as `"Methods"`.
 *
 * ### Example:
 * ```typescript
 * type MethodsTagOptions = $FluentTagOptions<"Methods">;
 * // MethodsTagOptions: "Record" | "Object" | "Property"
 * ```
 *
 * ### Behavior:
 * - For `"Methods"` tag type: Provides options `"Record" | "Object" | "Property"`.
 * - For unrecognized tag types: Returns `never`.
 */
export type $FluentTagOptions<TTagType extends $FluentTagTypeOptions> =
  TTagType extends "Methods" ? $FluentTagMethodsOptions : never;
