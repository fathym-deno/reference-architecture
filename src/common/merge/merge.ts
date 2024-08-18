import { deepMerge } from "./.deps.ts";

/**
 * Merges objects recursively, in a deep merge pattern. Any arrays, maps or sets that exist in both objects will be replaced with the new array.
 *
 * @param inputs The objects to merge. If there are multiple objects, they will be merged in the order they appear in the array.
 * @returns The merged objects.
 *
 * @example From direct import
 * ```typescript
 * import { merge } from '@fathym/common/merge';
 *
 * const merged = merge({ a: 1 }, { b: 2, c: 3 }, { c: 4, d: [1, 2, 3]}, { d: [4, 5, 6] });
 *
 * console.log(merged); // { a: 1, b: 2, c: 4, d: [4, 5, 6] }
 * ```
 *
 * @example From common import
 * ```typescript
 * import { merge } from '@fathym/common';
 *
 * const merged = merge({ a: 1 }, { b: 2, c: 3 }, { c: 4, d: [1, 2, 3]}, { d: [4, 5, 6] });
 *
 * console.log(merged); // { a: 1, b: 2, c: 4, d: [4, 5, 6] }
 * ```
 */
export function merge<T>(...inputs: object[]): T {
  return inputs.reduce((prev, cur) => {
    return deepMerge(prev, cur, {
      arrays: "replace",
      maps: "replace",
      sets: "replace",
    });
  }, {}) as T;
}

/**
 * Merges objects recursively, in a deep merge pattern. Any arrays, maps or sets that exist in both objects will be merged the new array.
 *
 * @param inputs The objects to merge. If there are multiple objects, they will be merged in the order they appear in the array.
 * @returns The merged objects.
 *
 * @example From direct import
 * ```typescript
 * import { mergeWithArrays } from '@fathym/common/merge';
 *
 * const merged = mergeWithArrays({ a: 1 }, { b: 2, c: 3 }, { c: 4, d: [1, 2, 3]}, { d: [4, 5, 6] });
 *
 * console.log(merged); // { a: 1, b: 2, c: 4, d: [1, 2, 3, 4, 5, 6] }
 * ```
 *
 * @example From common import
 * ```typescript
 * import { mergeWithArrays } from '@fathym/common';
 *
 * const merged = mergeWithArrays({ a: 1 }, { b: 2, c: 3 }, { c: 4, d: [1, 2, 3]}, { d: [4, 5, 6] });
 *
 * console.log(merged); // { a: 1, b: 2, c: 4, d: [1, 2, 3, 4, 5, 6] }
 * ```
 */
export function mergeWithArrays<T>(...inputs: object[]): T {
  return inputs.reduce((prev, cur) => {
    return deepMerge(prev, cur);
  }, {}) as T;
}
