/**
 * Extracts all data keys from a `$Tag` based on a tag type `TType`.
 *
 * If the tag does not exist (`$TagExists` is `false`), it returns `never`.
 * Otherwise, it returns the inferred keys associated with the tag.
 *
 * @template T - The type from which to extract tag data keys.
 * @template TType - The tag type (string) to extract keys from.
 */
export type $TagExtractDataKeys<
  T,
  TType extends string,
> = keyof {
  [K in keyof T as K extends `@${TType}-${infer U}` ? U : never]: true;
};
