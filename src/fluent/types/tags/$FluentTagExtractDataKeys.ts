import type { $TagExtractDataKeys } from "../../.deps.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * Extracts all the tag data keys from a $FluentTag.
 */
export type $FluentTagExtractDataKeys<
  T,
  TType extends $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType>,
> = $TagExtractDataKeys<T, TType, TTag>;
