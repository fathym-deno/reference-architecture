import type { $TagDeepStrip } from "../../.deps.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * Utility type to remove $FluentTag from the entire type tree.
 */
export type $FluentTagDeepStrip<
  T,
  TType extends $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType> = never,
> = $TagDeepStrip<T, TType, TTag>;
