import type { $TagExtractValueAndStrip } from "../../.deps.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * Extracts the tag data value from a $FluentTag type and returns it along with the stripped type.
 */
export type $FluentTagExtractValueAndStrip<
  T,
  TType extends $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType>,
  TData extends $FluentTagDataKeyOptions<TType>,
> = $TagExtractValueAndStrip<T, TType, TTag, TData>;
