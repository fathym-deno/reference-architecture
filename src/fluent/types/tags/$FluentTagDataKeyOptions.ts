import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * `$FluentTagMethodsDataKeyOptions` provides specific key options for `"Methods"` tag type.
 *
 * These keys represent different aspects of methods that can be tagged with metadata.
 *
 * ### Options:
 * - `"generic"`: A generic method key.
 * - `"handlers"`: A key for method handlers.
 */
export type $FluentTagMethodsDataKeyOptions = "generic" | "handlers";

/**
 * `$FluentTagDataKeyOptions<TType>` maps the provided tag type to its corresponding key options.
 *
 * This type enables different Fluent tag types to have their own sets of valid keys for tagging.
 * For example, for the `"Methods"` tag type, the available keys are `"generic"` and `"handlers"`.
 *
 * ### Parameters:
 * - `TType`: The base tag type, such as `"Methods"`.
 *
 * ### Example:
 * ```typescript
 * type MethodsDataKeys = $FluentTagDataKeyOptions<"Methods">;
 * // MethodsDataKeys: "generic" | "handlers"
 * ```
 *
 * ### Behavior:
 * - For `"Methods"` tag type: Provides key options `"generic" | "handlers"`.
 * - For unrecognized tag types: Returns `never`.
 */
export type $FluentTagDataKeyOptions<TType extends $FluentTagTypeOptions> =
  TType extends "Methods" ? $FluentTagMethodsDataKeyOptions : never;
