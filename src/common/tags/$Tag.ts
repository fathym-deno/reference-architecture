// deno-lint-ignore-file ban-types
/**
 * `$Tag<TType, TTag>` is a utility type used for tagging other types with metadata during type inference.
 * The key for the tag is created dynamically using the `TType` parameter and is prefixed with an `@` symbol.
 * If the `TTag` type is `never` or `undefined`, the tag is omitted.
 *
 * @template TType - A string representing the tag key. The final key will be prefixed with `@`.
 * @template TTag - The value associated with the tag. If this is `never` or `undefined`, the tag is omitted.
 */
export type $Tag<TType extends string, TTag> = [TTag] extends [
  never | undefined,
] ? {} // If TTag is never or undefined, return an empty object (omit the tag)
  : { [K in `@${TType}`]?: TTag }; // Otherwise, create the tag with key '@TType'
