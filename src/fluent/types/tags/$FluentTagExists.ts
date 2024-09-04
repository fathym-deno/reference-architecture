import type { $TagExists } from "../../.deps.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * Check if a $FluentTag exists with varying optional parameters. Check highlevel type, specific tag, or existing data values.
 */
export type $FluentTagExists<
  T,
  TType extends $FluentTagTypeOptions = $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType> = $FluentTagOptions<TType>,
  TData extends $FluentTagDataKeyOptions<TType> = $FluentTagDataKeyOptions<
    TType
  >,
> = $TagExists<T, TType, TTag, TData>;
