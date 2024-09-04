import type { HasTypeCheck } from "../HasTypeCheck.ts";
import type { $Tag } from "./$Tag.ts";

/**
 * Check if a $Tag exists with varying optional parameters. Check highlevel type, specific tag, or existing data values.
 */
export type $TagExists<
    T,
    TType extends string,
    TTag = unknown,
    TData extends string = never,
> = false extends HasTypeCheck<T, $Tag<TType, TTag>> ? false
    : [TData] extends [never] ? true
    : true extends HasTypeCheck<
        {
            // deno-lint-ignore no-explicit-any
            [K in `@${TType}-${TData}`]: any;
        },
        T
    > ? true
    : false;
