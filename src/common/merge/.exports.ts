/**
 * Helper functions for deep merging objects.
 * @module
 *
 * @example Merge from direct import
 * ```typescript
 * import { merge } from '@fathym/common/merge';
 *
 * const merged = merge({ a: 1 }, { b: 2, c: 3 }, { c: 4, d: [1, 2, 3]}, { d: [4, 5, 6] });
 *
 * console.log(merged); // { a: 1, b: 2, c: 4, d: [4, 5, 6] }
 * ```
 *
 * @example Merge with arrays from common import
 * import { mergeWithArrays } from '@fathym/common';
 *
 * const merged = mergeWithArrays({ a: 1 }, { b: 2, c: 3 }, { c: 4, d: [1, 2, 3]}, { d: [4, 5, 6] });
 *
 * console.log(merged); // { a: 1, b: 2, c: 4, d: [1, 2, 3, 4, 5, 6] }
 * ```
 */

export * from './merge.ts';
