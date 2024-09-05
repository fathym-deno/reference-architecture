import type { $TagValues } from '../../.deps.ts';
import type { $FluentTagTypeOptions } from './$FluentTagTypeOptions.ts';
import type { $FluentTagOptions } from './$FluentTagOptions.ts';
import type { $FluentTagDataKeyOptions } from './$FluentTagDataKeyOptions.ts';
import type { $FluentTagDataValueTypesOptions } from './$FluentTagDataValueOptions.ts';

/**
 * A type used for tagging other types with Fluent type inference controls.
 */
export type $FluentTag<
  TType extends $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType>,
  TData extends $FluentTagDataKeyOptions<TType> = never,
  TValues extends {
    [K in TData extends infer KData
      ? KData extends $FluentTagDataKeyOptions<TType> // Ensure KData satisfies the constraint
        ? KData
        : never
      : never]: $FluentTagDataValueTypesOptions<TType, K>;
  } = never
> = $TagValues<TType, TTag, TData, TValues>;
