import type { $TagExtractDataKeys } from "../../.deps.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * Extracts all the tag data keys from a $FluentTag.
 */
export type $FluentTagExtractDataKeys<
  T,
  TType extends $FluentTagTypeOptions,
> = $TagExtractDataKeys<T, TType>;
