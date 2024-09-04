import type { $TagExists } from "./$TagExists.ts";

/**
 * Extracts the tag data value from a $Tag type.
 */

export type $TagExtractValue<
    T,
    TType extends string,
    TTag,
    TData extends string,
> = false extends $TagExists<T, TType, TTag> ? never : T extends {
    [Key in `@${TType}-${TData}`]?: infer TValue;
} ? TValue
: never;
