/**
 * A type used for tagging other types with metadata, to be used during type inference.
 */
export type $Tag<
    TType extends string,
    TTag,
    TData extends string,
    TValues extends Record<TData, any>,
> =
    & {
        [K in `@${TType}`]?: TTag;
    }
    & {
        [Key in keyof TValues as `@${TType}-${Key & TData}`]?: TValues[Key];
    };
