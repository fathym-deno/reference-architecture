import type { $TagExtractValueAndStrip } from "../../.deps.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * `$FluentTagExtractValueAndStrip<T, TType, TTag, TData>` extracts the tag data value from a `$FluentTag` type `T`
 * and returns the result alongside the stripped version of the type `T` (without the tag metadata).
 *
 * This utility works by:
 * - Extracting the `Value` of the tag data from the tag of type `TType`.
 * - Stripping the tag and metadata from the original type `T`, producing the `Stripped` version.
 *
 * ### Parameters:
 * - `T`: The type from which to extract the tag data value and strip metadata.
 * - `TType`: The Fluent tag type, derived from `$FluentTagTypeOptions`, used to identify metadata keys.
 * - `TTag`: The specific Fluent tag to match, derived from `$FluentTagOptions<TType>`.
 * - `TData`: The specific tag data key to extract the value from, derived from `$FluentTagDataKeyOptions<TType>`.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```typescript
 * type TestTag = {
 *   '@Methods': 'Object';
 *   '@Methods-generic': boolean;
 *   unrelatedKey: string;
 * };
 *
 * type Result = $FluentTagExtractValueAndStrip<
 *   TestTag,
 *   'Methods',
 *   'Object',
 *   'generic'
 * >;
 *
 * // Result:
 * // {
 * //   Stripped: { unrelatedKey: string };
 * //   Value: boolean;
 * // }
 * ```
 *
 * #### Record and Complex Object Usage:
 * ```typescript
 * type ComplexTag = {
 *   '@Methods': 'Record';
 *   '@Methods-handlers': Record<string, (...args: any[]) => void>;
 *   unrelatedKey: number;
 * };
 *
 * type ComplexResult = $FluentTagExtractValueAndStrip<
 *   ComplexTag,
 *   'Methods',
 *   'Record',
 *   'handlers'
 * >;
 *
 * // Result:
 * // {
 * //   Stripped: { unrelatedKey: number };
 * //   Value: Record<string, (...args: any[]) => void>;
 * // }
 * ```
 *
 * ### Returns:
 * - `Stripped`: The input type `T` with all Fluent tag metadata removed.
 * - `Value`: The extracted tag data value associated with `TData`.
 */
export type $FluentTagExtractValueAndStrip<
  T,
  TType extends $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType>,
  TData extends $FluentTagDataKeyOptions<TType>,
> = $TagExtractValueAndStrip<T, TType, TTag, TData>;
