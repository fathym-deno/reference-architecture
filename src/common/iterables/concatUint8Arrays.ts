/**
 * Concatenate two Uint8Array objects into a new Uint8Array object.
 *
 * @param a The first Uint8Array to concatenate before the second.
 * @param b The second Uint8Array to concatenate to the end of the first.
 * @returns The concatenated Uint8Array value.
 *
 * @example From direct import
 * ```typescript
 * import { Uint8Array } from '@fathym/common/iterables';
 *
 * const a = new Uint8Array([1, 2, 3]);
 * const b = new Uint8Array([4, 5, 6]);
 *
 * const concatenated = concatUint8Arrays(a, b);
 *
 * console.log(concatenated); // [1, 2, 3, 4, 5, 6]
 * ```
 *
 * @example From common import
 * ```typescript
 * import { Uint8Array } from '@fathym/common';
 *
 * const a = new Uint8Array([1, 2, 3]);
 * const b = new Uint8Array([4, 5, 6]);
 *
 * const concatenated = concatUint8Arrays(b, a);
 *
 * console.log(concatenated); // [4, 5, 6, 1, 2, 3]
 * ```
 */
export function concatUint8Arrays(
  a: Uint8Array,
  b: Uint8Array,
): Uint8Array<ArrayBuffer> {
  const length = a.length + b.length;

  const c = new Uint8Array(new ArrayBuffer(length));

  c.set(a, 0);
  c.set(b, a.length);

  return c;
}
