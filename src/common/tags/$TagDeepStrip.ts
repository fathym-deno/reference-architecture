// deno-lint-ignore-file no-explicit-any
import type { $TagStrip } from "./$TagStrip.ts";

/**
 * `$TagDeepStrip<T, TType, TTag>` recursively removes `$Tag` metadata from the entire type tree.
 *
 * This utility type strips tag metadata from any structure, including:
 * - Primitive types (directly handled by `$TagStrip`).
 * - Arrays (handled by `$TagDeepStripArray`).
 * - Tuples (handled by `$TagDeepStripTuple`).
 * - Objects (handled by `$TagDeepStripObject`).
 *
 * This type ensures that no metadata keys prefixed with `@${TType}` remain, including deeply nested structures.
 *
 * @template T - The input type to be stripped of `$Tag` metadata.
 * @template TType - The tag type (string) used to identify metadata keys.
 * @template TTag - The specific tag to match (optional, default is `never`).
 */
export type $TagDeepStrip<
  T,
  TType extends string,
  TTag = never,
> = T extends infer U ? U extends any[] ? $TagDeepStripArray<U, TType, TTag> // Handle arrays by delegating to $TagDeepStripArray
  : U extends [infer F, ...infer R] ? $TagDeepStripTuple<U, TType, TTag> // Handle tuples by delegating to $TagDeepStripTuple
  : U extends object ? $TagDeepStripObject<U, TType, TTag> // Handle objects by delegating to $TagDeepStripObject
  : $TagStrip<U, TType, TTag> // Handle primitive types using $TagStrip
  : never;

/**
 * `$TagDeepStripArray<T, TType, TTag>` removes `$Tag` from arrays recursively.
 *
 * For each element of the array `T`, the type recursively applies `$TagDeepStrip` to ensure
 * that tag metadata is removed from all nested elements.
 *
 * @template T - The array type to be stripped of `$Tag` metadata.
 * @template TType - The tag type (string) used to identify metadata keys.
 * @template TTag - The specific tag to match (optional, default is `never`).
 */
export type $TagDeepStripArray<
  T extends any[],
  TType extends string,
  TTag = never,
> = {
  [K in keyof $TagStrip<T, TType, TTag>]: $TagDeepStrip<
    $TagStrip<T, TType, TTag>[K],
    TType,
    TTag
  >;
};

/**
 * `$TagDeepStripTuple<T, TType, TTag>` removes `$Tag` from tuples recursively.
 *
 * For each element of the tuple `T`, the type recursively applies `$TagDeepStrip` to ensure
 * that tag metadata is removed from all tuple elements.
 *
 * @template T - The tuple type to be stripped of `$Tag` metadata.
 * @template TType - The tag type (string) used to identify metadata keys.
 * @template TTag - The specific tag to match (optional, default is `never`).
 */
export type $TagDeepStripTuple<
  T extends [any, ...any[]],
  TType extends string,
  TTag = never,
> = {
  [K in keyof $TagStrip<T, TType, TTag>]: $TagDeepStrip<
    $TagStrip<T, TType, TTag>[K],
    TType,
    TTag
  >;
};

/**
 * `$TagDeepStripObject<T, TType, TTag>` removes `$Tag` from objects recursively.
 *
 * For each property of the object `T`, the type recursively applies `$TagDeepStrip` to ensure
 * that tag metadata is removed from all properties of the object, including nested properties.
 *
 * @template T - The object type to be stripped of `$Tag` metadata.
 * @template TType - The tag type (string) used to identify metadata keys.
 * @template TTag - The specific tag to match (optional, default is `never`).
 */
export type $TagDeepStripObject<
  T extends object,
  TType extends string,
  TTag = never,
> = {
  [K in keyof $TagStrip<T, TType, TTag>]: $TagDeepStrip<
    $TagStrip<T, TType, TTag>[K],
    TType,
    TTag
  >;
};
