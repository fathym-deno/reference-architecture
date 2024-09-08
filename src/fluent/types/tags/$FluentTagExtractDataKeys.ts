import type { $TagExtractDataKeys } from "../../.deps.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * `$FluentTagExtractDataKeys<T, TType>` extracts all the data keys from a `$FluentTag` based on the tag type `TType`.
 *
 * This type is a specialized version of `$TagExtractDataKeys` that works with `$FluentTag`.
 * It extracts the data keys associated with a specific Fluent tag type, allowing the user to retrieve
 * the metadata keys associated with the tag.
 *
 * ### Parameters:
 * - `T`: The type from which to extract the Fluent tag data keys.
 * - `TType`: The Fluent tag type (from `$FluentTagTypeOptions`) to extract keys from.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```typescript
 * type TestTag = {
 *   '@FluentTag-id': string;
 *   '@FluentTag-name': string;
 *   unrelatedKey: number;
 * };
 *
 * type ExtractedKeys = $FluentTagExtractDataKeys<TestTag, 'FluentTag'>;
 * // Result: "id" | "name"
 * ```
 *
 * #### Working with Complex Records:
 * ```typescript
 * type ComplexRecord = {
 *   '@FluentTag-key1': string;
 *   '@FluentTag-key2': number;
 *   otherKey: boolean;
 * };
 *
 * type ExtractedKeys = $FluentTagExtractDataKeys<ComplexRecord, 'FluentTag'>;
 * // Result: "key1" | "key2"
 * ```
 */
export type $FluentTagExtractDataKeys<
  T,
  TType extends $FluentTagTypeOptions,
> = $TagExtractDataKeys<T, TType>;
