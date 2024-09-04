import type { $TagStrip } from "./$TagStrip.ts";

/**
 * Utility type to remove $Tag from the entire type tree.
 */
export type $TagDeepStrip<T, TType extends string, TTag = unknown> = $TagStrip<
  {
    [K in keyof T]: T[K] extends never ? never
      : T[K] extends (infer U)[] ? $TagDeepStrip<U, TType, TTag>[]
      : T extends object ? $TagDeepStrip<T[K], TType, TTag>
      : $TagStrip<T[K], TType, TTag>;
  },
  TType,
  TTag
>;
