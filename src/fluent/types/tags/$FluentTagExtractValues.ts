import type { $TagExtractValues } from "../../.deps.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * `$FluentTagExtractValues<T, TType, TData>` extracts all tag data values from a `$FluentTag` type `T`
 * in a nested structure, based on the tag type `TType` and tag data `TData`.
 *
 * It dynamically infers the value `TValue` for each tag and returns `NonNullable<TValue>`.
 *
 * ### Parameters:
 * - `T`: The type from which to extract the tag data values.
 * - `TType`: The tag type (string) to extract the values from (must extend `$FluentTagTypeOptions`).
 * - `TData`: The tag data (string) to extract the values from (must extend `$FluentTagDataKeyOptions<TType>`).
 *
 * ### Example Usage:
 * ```typescript
 * type FluentTag = $FluentTag<
 *   "Methods",
 *   "Record",
 *   "generic" | "handlers",
 *   { generic: true; handlers: { save: () => void } }
 * >;
 *
 * type ExtractedValues = $FluentTagExtractValues<
 *   FluentTag,
 *   "Methods",
 *   "generic" | "handlers"
 * >;
 * // Result:
 * // {
 * //   Methods: {
 * //     generic: true;
 * //     handlers: { save: () => void };
 * //   };
 * // }
 * ```
 */
export type $FluentTagExtractValues<
  T,
  TType extends $FluentTagTypeOptions,
  TData extends $FluentTagDataKeyOptions<TType>,
> = $TagExtractValues<T, TType, TData>;
