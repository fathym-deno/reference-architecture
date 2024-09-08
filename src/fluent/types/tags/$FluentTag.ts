import type { $TagValues } from "../../.deps.ts";
import type { $FluentTagTypeOptions } from "./$FluentTagTypeOptions.ts";
import type { $FluentTagOptions } from "./$FluentTagOptions.ts";
import type { $FluentTagDataKeyOptions } from "./$FluentTagDataKeyOptions.ts";
import type { $FluentTagDataValueTypesOptions } from "./$FluentTagDataValueOptions.ts";

/**
 * `$FluentTag<TType, TTag, TData, TValues>` is used to apply Fluent tagging metadata to types,
 * enforcing Fluent type inference controls. This type allows you to attach both primary and
 * additional metadata values (`TValues`) based on `TData`.
 *
 * ### Parameters:
 * - `TType`: The type option from `$FluentTagTypeOptions` representing the base tag key.
 * - `TTag`: The value associated with the tag, derived from `$FluentTagOptions<TType>`.
 * - `TData`: The additional keys to append to the base tag (`TType`), constrained by `$FluentTagDataKeyOptions<TType>`. Defaults to `never`.
 * - `TValues`: An object mapping `TData` keys to values, where each key is validated against `$FluentTagDataValueTypesOptions<TType, K>`.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```typescript
 * type BasicFluentTag = $FluentTag<'action', string>;
 * // Result: { '@action'?: string }
 * ```
 *
 * #### With Additional Metadata:
 * ```typescript
 * type FluentTagWithMetadata = $FluentTag<
 *   'action',
 *   string,
 *   'target' | 'status',
 *   { target: string; status: boolean }
 * >;
 * // Result: { '@action'?: string; '@action-target'?: string; '@action-status'?: boolean }
 * ```
 */
export type $FluentTag<
  TType extends $FluentTagTypeOptions,
  TTag extends $FluentTagOptions<TType>,
  TData extends $FluentTagDataKeyOptions<TType> = never,
  TValues extends {
    [
      K in TData extends infer KData
        ? KData extends $FluentTagDataKeyOptions<TType> // Ensure KData satisfies the constraint
          ? KData
        : never
        : never
    ]: $FluentTagDataValueTypesOptions<TType, K>;
  } = never,
> = $TagValues<TType, TTag, TData, TValues>;
