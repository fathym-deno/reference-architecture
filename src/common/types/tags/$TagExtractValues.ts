/**
 * Extracts all the tag data values from a $Tag type in a nested structure.
 */

import type { $TagExists } from "./$TagExists.ts";

export type $TagExtractValues<
    T,
    TType extends string,
    TTag,
    TData extends string,
> = false extends $TagExists<T, TType, TTag> ? never
    : {
        [KType in TType]: {
            [KData in TData]: T extends {
                [Key in `@${KType}-${KData}`]?: infer TValue;
            } ? TValue
                : never;
        };
    };
