import type { ExtractKeysByPrefix, NoPropertiesUndefined } from "./.deps.ts";
import type { $Tag } from "./$Tag.ts";
import type { $TagExists } from "./$TagExists.ts";

/**
 * `$TagExtract<T, TType>` extracts the tag value from a $Tag type `T` based on the tag type `TType`.
 *
 * If the tag does not exist (`$TagExists` is `false`), it returns `never`.
 * Otherwise, it extracts the tag's value, ensuring no properties are undefined (`NoPropertiesUndefined`).
 *
 * @template T - The type from which to extract the tag.
 * @template TType - The tag type (string) to extract the value from.
 */
export type $TagExtract<T, TType extends string> = false extends $TagExists<
  T,
  TType
> ? never
  : NoPropertiesUndefined<
    ExtractKeysByPrefix<T, "@">
  > extends NoPropertiesUndefined<$Tag<TType, infer TValue>>
    ? NonNullable<TValue>
  : never;
