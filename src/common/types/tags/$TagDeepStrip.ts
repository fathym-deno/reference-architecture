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
export type $TagDeepStrip<
  T,
  TType extends string,
  TTag = never,
> = T extends any[] ? $TagDeepStripArray<T, TType, TTag>
  : T extends [infer F, ...infer R] ? $TagDeepStripTuple<T, TType, TTag>
  : T extends object ? $TagDeepStripObject<T, TType, TTag>
  : $TagStrip<T, TType, TTag>;

/**
 * Utility type to remove $Tag from arrays.
 */
export type $TagDeepStripArray<
  T extends any[],
  TType extends string,
  TTag = never,
> = {
  [K in keyof $TagStrip<T, TType, TTag>]: $TagDeepStrip<T[K], TType, TTag>;
};

/**
 * Utility type to remove $Tag from tuples.
 */
export type $TagDeepStripTuple<
  T extends [any, ...any[]],
  TType extends string,
  TTag = never,
> = {
  [K in keyof $TagStrip<T, TType, TTag>]: $TagDeepStrip<T[K], TType, TTag>;
};

/**
 * Utility type to remove $Tag from objects.
 */
export type $TagDeepStripObject<
  T extends object,
  TType extends string,
  TTag = never,
> = {
  [K in keyof $TagStrip<T, TType, TTag>]: $TagDeepStrip<T[K], TType, TTag>;
};
