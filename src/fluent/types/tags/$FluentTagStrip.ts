import type { $TagStrip } from "../../.deps.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * Utility type to remove $FluentTag and metadata from a single property
 */
export type $FluentTagStrip<
  T,
  TType extends $FluentTagTypeOptions = $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType> = $FluentTagOptions<TType>,
  TData extends $FluentTagDataKeyOptions<TType> = $FluentTagDataKeyOptions<
    TType
  >,
  TExact extends boolean = false,
> = $TagStrip<T, TType, TTag, TData, TExact>;
