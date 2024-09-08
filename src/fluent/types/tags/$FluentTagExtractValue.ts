import type { $TagExtractValue } from "../../.deps.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * `$FluentTagExtractValue<T, TType, TData>` extracts the tag data value from a `$FluentTag` type `T`
 * based on a tag type `TType` and a specific tag data key `TData`.
 *
 * It returns the inferred value of the tag data if it exists; otherwise, it returns `never`.
 *
 * ### Parameters:
 * - `T`: The input type containing the `$FluentTag` to extract the value from.
 * - `TType`: The tag type to match (e.g., `'Methods'` or `'Object'`).
 * - `TData`: The specific tag data key (e.g., `'handlers'`, `'generic'`) to extract the value from.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```ts
 * type ExtractedValue = $FluentTagExtractValue<
 *   { '@Methods-handlers': { save: () => void } },
 *   'Methods',
 *   'handlers'
 * >;
 * // Result: { save: () => void }
 * ```
 *
 * #### Extracting from Record types:
 * ```ts
 * type ExtractedFromRecord = $FluentTagExtractValue<
 *   { '@Methods-handlers': Record<string, (...args: any[]) => any> },
 *   'Methods',
 *   'handlers'
 * >;
 * // Result: Record<string, (...args: any[]) => any>
 * ```
 */
export type $FluentTagExtractValue<
  T,
  TType extends $FluentTagTypeOptions,
  TData extends $FluentTagDataKeyOptions<TType>,
> = $TagExtractValue<T, TType, TData>;
