import type { $TagExtractValue } from "../../.deps.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * Extracts the tag data value from a $FluentTag type.
 */
export type $FluentTagExtractValue<
  T,
  TType extends $FluentTagTypeOptions,
  TData extends $FluentTagDataKeyOptions<TType>,
> = $TagExtractValue<T, TType, TData>;
