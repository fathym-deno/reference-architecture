import type { $TagExtractValues } from "../../.deps.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * Extracts all the tag data values from a $FluentTag type in a nested structure.
 */
export type $FluentTagExtractValues<
  T,
  TType extends $FluentTagTypeOptions,
  TData extends $FluentTagDataKeyOptions<TType>,
> = $TagExtractValues<T, TType, TData>;
