import type { ExcludeKeys } from "../types/ExcludeKeys.ts";
import type { ExcludeKeysByPrefix } from "../types/ExcludeKeysByPrefix.ts";
import type { $TagExists } from "./$TagExists.ts";
import type { HasKeys } from "./.deps.ts";

/**
 * `$TagStrip<T, TType, TTag, TData, TExact>` removes tag metadata from a property.
 *
 * If `TExact` is `true`, it removes only the exact `@${TType}-${TData}` keys.
 * If `TExact` is `false`, it removes all keys prefixed with `@${TType}`.
 *
 * @template T - The type from which to strip the tag metadata.
 * @template TType - The tag type (string) used to identify metadata keys.
 * @template TTag - The specific tag to match (optional).
 * @template TData - The data key to match (optional).
 * @template TExact - A flag indicating whether to strip only exact matches (true) or all prefixed keys (false).
 */
export type $TagStrip<
  T,
  TType extends string,
  TTag = never,
  TData extends string = never,
  TExact extends boolean = false,
> = false extends HasKeys<T, `@${TType}`> // Check that the Type even has tag type keys
  ? T // If no tag type keys, return the original type
  : true extends TExact // If tag type keys, Check if it is exact match strip
    ? [TData] extends [never] // If Exact, check for TData
      ? [TTag] extends [never] // If no TData, check for TTag
        ? T // If no TTag, return the original type
      : ExcludeKeys<T, `@${TType}`> // If TTag, return type with Tag excluded
    : [TTag] extends [never] // If TData, check for TTag
      ? ExcludeKeys<T, `@${TType}-${TData}`> // If no TTag, return type with TData tag excluded
    : false extends $TagExists<T, TType, TTag> // If TTag, check to see if the tag exists
      ? T // If no TTag, return original type
    : ExcludeKeys<T, `@${TType}-${TData}`> // If TTag, return type with TData tag excluded
  : [TData] extends [never] // If not exact, check for TData
    ? [TTag] extends [never] // If not TData, check for TTag
      ? ExcludeKeysByPrefix<T, `@${TType}`> // If no TTag, strip all TData for TType
    : false extends $TagExists<T, TType, TTag> // If TTag, check to see if the tag exists
      ? T // If no TTag exists, return original type
    : ExcludeKeysByPrefix<T, `@${TType}`> // If TTag, strip
  : ExcludeKeysByPrefix<T, `@${TType}-@${TData}`>; // TData, check for TTag
