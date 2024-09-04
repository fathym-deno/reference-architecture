import type { $TagExtract } from '../../.deps.ts';
import type { $FluentTagTypeOptions } from './$FluentTagTypeOptions.ts';

/**
 * Extracts the tag from a $FluentTag type.
 */
export type $FluentTagExtract<
  T,
  TType extends $FluentTagTypeOptions
> = $TagExtract<T, TType>;
