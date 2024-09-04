/**
 * A type used for tagging other types, to be used during type inference.
 */
export type $Tag<TType extends string, TTag> = {
    [K in `@${TType}`]?: TTag;
};
