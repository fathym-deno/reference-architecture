import type { $TagExists } from "./$TagExists.ts";

/**
 * Extracts all the tag data keys from a $Tag.
 */
export type $TagExtractDataKeys<
  T,
  TType extends string,
  TTag,
> = false extends $TagExists<T, TType, TTag> ? never
  : keyof {
    [K in keyof T as K extends `@${TType}-${infer U}` ? U : never]: true;
  };
