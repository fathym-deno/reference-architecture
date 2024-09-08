import type { $TagExtract } from "../../.deps.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * `$FluentTagExtract<T, TType>` extracts the tag value from a $FluentTag type `T`
 * based on the specified `TType`, utilizing the `$TagExtract` utility for extraction.
 *
 * This type is useful when working with Fluent tagging systems that need to extract
 * metadata associated with a specific `TType` from a type `T`.
 *
 * ### Parameters:
 * - `T`: The type from which to extract the Fluent tag.
 * - `TType`: The tag type option, constrained by `$FluentTagTypeOptions`.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```typescript
 * type ExampleTag = $FluentTag<'Methods', 'Object'>;
 * type ExtractedTag = $FluentTagExtract<ExampleTag, 'Methods'>;
 * // Result: 'Object'
 * ```
 *
 * #### With Complex Tag Values:
 * ```typescript
 * type ComplexTag = $FluentTag<'Methods', 'Record', 'handlers', { handlers: Record<string, () => void> }>;
 * type ExtractedTag = $FluentTagExtract<ComplexTag, 'Methods'>;
 * // Result: { handlers: Record<string, () => void> }
 * ```
 *
 * #### Nested Record Example:
 * ```typescript
 * type NestedTag = Record<string, $FluentTag<'Methods', 'Record'>>;
 * type ExtractedTag = $FluentTagExtract<NestedTag['key'], 'Methods'>;
 * // Result: 'Record'
 * ```
 */
export type $FluentTagExtract<
  T,
  TType extends $FluentTagTypeOptions,
> = $TagExtract<T, TType>;
