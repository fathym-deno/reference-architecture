import type { $TagDeepStrip } from "../../.deps.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * `$FluentTagDeepStrip<T, TType, TTag>` is a utility type that recursively removes `$FluentTag`
 * metadata from the entire type tree, delegating the operation to `$TagDeepStrip`.
 *
 * This type is used to remove tags added by `$FluentTag` from all properties of a type,
 * including arrays, tuples, objects, and nested structures.
 *
 * ### Parameters:
 * - `T`: The input type to be stripped of `$FluentTag` metadata.
 * - `TType`: The tag type (string) used to identify metadata keys, constrained by `$FluentTagTypeOptions`.
 * - `TTag`: The specific tag to match, derived from `$FluentTagOptions<TType>`. Defaults to `never`.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```typescript
 * type BasicTag = $FluentTagDeepStrip<{ '@Methods': 'Record' }, 'Methods'>;
 * // Result: {}
 * ```
 *
 * #### Nested Record with FluentTag:
 * ```typescript
 * type ComplexTag = $FluentTagDeepStrip<
 *   { '@Methods': 'Object'; inner: { '@Methods-generic': true } },
 *   'Methods'
 * >;
 * // Result: { inner: {} }
 * ```
 */
export type $FluentTagDeepStrip<
  T,
  TType extends $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType> = never,
> = $TagDeepStrip<T, TType, TTag>;
