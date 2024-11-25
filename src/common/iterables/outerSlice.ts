/**
 * Create a new array by slicing from the start and end of the input array.
 * Ensures no duplicate items are included even if slices overlap.
 *
 * @param arr The input array to slice. If undefined, returns an empty array.
 * @param fromStart The number of elements to take from the start of the array.
 * @param toEnd The number of elements to take from the end of the array.
 * @returns A new array containing the non-overlapping sliced elements.
 *
 * @example From direct import
 * ```typescript
 * const arr = [1, 2, 3, 4, 5];
 *
 * const sliced = outerSlice(arr, 2, 2);
 * console.log(sliced); // [1, 2, 4, 5]
 * ```
 */
export function outerSlice<T>(arr: T[], fromStart: number, toEnd: number): T[] {
  if (!arr?.length) {
    return [];
  }

  const startSlice = arr.slice(0, fromStart);

  const endSlice = arr.slice(-toEnd);

  const result = Array.from(new Set([...startSlice, ...endSlice]));

  return result;
}
