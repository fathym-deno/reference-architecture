import type { ExtractKeysByPrefix, NoPropertiesUndefined } from "./.deps.ts";

/**
 * `$TagExtractValue<T, TType, TData>` extracts the tag data value from a $Tag type `T`
 * based on a tag type `TType` and tag data `TData`.
 *
 * If the tag data value exists, it returns the inferred value `TValue`. Otherwise, it returns `never`.
 *
 * @template T - The type from which to extract the tag data value.
 * @template TType - The tag type (string) to extract the value from.
 * @template TData - The specific tag data key to extract the value from.
 */
export type $TagExtractValue<
  T,
  TType extends string,
  TData extends string,
> = NoPropertiesUndefined<ExtractKeysByPrefix<T, "@">> extends {
  [Key in `@${TType}-${TData}`]: infer TValue;
} ? NonNullable<TValue>
  : never;
