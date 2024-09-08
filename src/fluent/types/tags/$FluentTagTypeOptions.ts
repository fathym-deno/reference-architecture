/**
 * `$FluentTagTypeOptions` defines the available tag type options for Fluent tagging.
 *
 * This type controls the base tag used for categorizing different types of metadata in Fluent tagging.
 * The only available option is `"Methods"`, representing method-related metadata in the Fluent system.
 *
 * ### Example:
 * ```typescript
 * type FluentTagType = $FluentTagTypeOptions;
 * // FluentTagType: "Methods"
 * ```
 */
export type $FluentTagTypeOptions = "Methods";
