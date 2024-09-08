import type { $Tag } from "./$Tag.ts";

/**
 * `$TagValues<TType, TTag, TData, TValues>` is a utility type for tagging other types with metadata
 * values during type inference. It allows attaching multiple key-value pairs (`TValues`) alongside
 * the primary tag.
 *
 * ### Parameters:
 * - `TType`: A string representing the base tag key.
 * - `TTag`: The main value associated with the tag. If `TTag` is `never` or `undefined`, the tag is omitted (handled by `$Tag`).
 * - `TData`: A string representing additional keys to append to the base tag (`TType`). Defaults to `never` if no additional keys are provided.
 * - `TValues`: An optional object mapping additional `TData` keys to values, where each key becomes part of a tag.
 *
 * ### Behavior:
 * - If `TData` is `never`, only the base tag (`TType`) and its associated `TTag` are added.
 * - If `TData` is provided, each key in `TData` is appended to the base tag (`TType`), and the values in `TValues` are used for the tags.
 *
 * ### Example:
 *
 * #### Basic Usage:
 * ```typescript
 * type Tagged = $TagValues<'test', string>;
 * // Result: { '@test'?: string }
 * ```
 *
 * #### With Additional Metadata:
 * ```typescript
 * type TaggedWithValues = $TagValues<'test', string, 'label', { label: boolean }>;
 * // Result: { '@test'?: string, '@test-label'?: boolean }
 * ```
 *
 * #### Complex Example:
 * ```typescript
 * type ComplexTagged = $TagValues<'status', { active: boolean }, 'info' | 'error', { info: string; error: string }>;
 * // Result: { '@status'?: { active: boolean }, '@status-info'?: string, '@status-error'?: string }
 * ```
 */
export type $TagValues<
  TType extends string,
  TTag,
  TData extends string = never,
  TValues extends { [K in TData]?: unknown } = never,
> = [TData] extends [never] ? $Tag<TType, TTag>
  :
    & $Tag<TType, TTag>
    & {
      [Key in keyof TValues as `@${TType}-${Key & TData}`]?: TValues[Key];
    };
