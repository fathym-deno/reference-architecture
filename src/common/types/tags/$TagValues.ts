import type { $Tag } from "./$Tag.ts";

/**
 * A type used for tagging other types with metadata values, to be used during type inference.
 */
export type $TagValues<
    TType extends string,
    TTag,
    TData extends string = never,
    // deno-lint-ignore no-explicit-any
    TValues extends Record<TData, any> = never,
> =
    & $Tag<TType, TTag>
    & {
        [Key in keyof TValues as `@${TType}-${Key & TData}`]?: TValues[Key];
    };
