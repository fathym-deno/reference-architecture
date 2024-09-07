// deno-lint-ignore-file no-explicit-any
import type { $TagStrip } from "./$TagStrip.ts";

/**
 * Utility type to remove $Tag from the entire type tree.
 */
// export type $TagDeepStrip<T, TType extends string, TTag = never> = $TagStrip<
//   {
//     [K in keyof T]: T[K] extends never ? never
//       : T[K] extends (infer U)[] ? $TagDeepStrip<U, TType, TTag>[]
//       : T extends object ? $TagDeepStrip<T[K], TType, TTag>
//       : $TagStrip<T[K], TType, TTag>;
//   },
//   TType,
//   TTag
// >;
/**
 * Utility type to remove $Tag from the entire type tree.
 */
// export type $TagDeepStrip<
//   T,
//   TType extends string,
//   TTag = never,
// > = T extends infer U ? U extends any[] ? $TagDeepStripArray<U, TType, TTag>
//   : U extends [infer F, ...infer R] ? $TagDeepStripTuple<U, TType, TTag>
//   : U extends object ? $TagDeepStripObject<U, TType, TTag>
//   : $TagStrip<U, TType, TTag>
//   : $TagStrip<T, TType, TTag>;

export type $TagDeepStrip<
  T,
  TType extends string,
  TTag = never,
> = T extends infer U ? U extends any[] ? $TagDeepStripArray<U, TType, TTag>
  : U extends [infer F, ...infer R] ? $TagDeepStripTuple<U, TType, TTag>
  : U extends object ? $TagDeepStripObject<U, TType, TTag>
  : $TagStrip<U, TType, TTag>
  : never;

/**
 * Utility type to remove $Tag from arrays.
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
 * Utility type to remove $Tag from tuples.
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
 * Utility type to remove $Tag from objects.
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
