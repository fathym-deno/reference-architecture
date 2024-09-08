import type { $TagStrip } from "../../.deps.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";

/**
 * `$FluentTagStrip<T, TType, TTag, TData, TExact>` removes $FluentTag metadata from a property.
 *
 * If `TExact` is `true`, it removes only the exact `@${TType}-${TData}` keys.
 * If `TExact` is `false`, it removes all keys prefixed with `@${TType}`.
 *
 * ### Parameters:
 * - `T`: The type from which to strip the Fluent tag metadata.
 * - `TType`: The tag type (string) representing the base Fluent tag key (e.g., `'Methods'`).
 * - `TTag`: The specific Fluent tag value associated with the tag (optional).
 * - `TData`: The tag data key to match (optional).
 * - `TExact`: A flag indicating whether to strip only exact matches (true) or all prefixed keys (false).
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```ts
 * type TestTag = {
 *   '@Methods-handlers': { save: () => void };
 *   unrelatedKey: string;
 * };
 *
 * type Stripped = $FluentTagStrip<TestTag, 'Methods', 'Object', 'handlers'>;
 * // Result: { unrelatedKey: string }
 * ```
 */
export type $FluentTagStrip<
  T,
  TType extends $FluentTagTypeOptions = $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType> = never,
  TData extends $FluentTagDataKeyOptions<TType> = never,
  TExact extends boolean = false,
> = $TagStrip<T, TType, TTag, TData, TExact>;
