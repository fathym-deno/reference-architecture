/**
 * Helpers to assist with iterable operations and management.
 * @module
 *
 * @example Concat Uint8Arrays from direct import
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
 * @example Convert Async Iterable fsrom direct import
 * ```typescript
 * import { convertAsyncIterable } from '@fathym/common/iterables';
 *
 * const asyncIterable = {
 *  [Symbol.asyncIterator]() {
 *    let i = 0;
 *
 *    return {
 *      next() {
 *        if (i < 3) {
 *          return Promise.resolve(i);
 *        }
 *
 *        return Promise.resolve(i);
 *      };
 *    }
 *  }
 * };
 *
 * const ai = await convertAsyncIterable(asyncIterable, async (i) => i * 2);
 *
 * console.log(Array.from(ai)); // [0, 2, 4, 6]
 * ```
 *
 * @example Queue from direct import
 * ```typescript
 * import { Queue } from "@fathym/common/iterables";
 *
 * const queue = new Queue<number>();
 *
 * queue.Enqueue(1);
 *
 * queue.Enqueue(2);
 *
 * queue.Dequeue(); // Output: 1
 *
 * queue.Peek(); // Output: 2
 *
 * queue.Dequeue(); // Output: 2
 *
 * queue.IsEmpty(); // Output: true
 * ```
 *
 * @example Stack from direct import
 * ```typescript
 * import { Stack } from "@fathym/common/iterables";
 *
 * const stack = new Stack<number>();
 *
 * stack.Push(1);
 *
 * stack.Push(2);
 *
 * stack.Pop(); // Output: 2
 *
 * stack.Peek(); // Output: 1
 *
 * stack.Pop(); // Output: 1
 *
 * stack.IsEmpty(); // Output: true
 * ```
 * 
 * @example outerSlice from direct import
 * import { outerSlice } from "@fathym/common/iterables";
 *
 * ```typescript
 * const arr = [1, 2, 3, 4, 5];
 *
 * const sliced = outerSlice(arr, 2, 2);
 * 
 * console.log(sliced); // [1, 2, 4, 5]
 * ```
 */

export * from './json-map-set/.exports.ts';
export * from './concatUint8Arrays.ts';
export * from './convertAsyncIterable.ts';
export * from './outerSlice.ts';
export * from './Stack.ts';
export * from './Queue.ts';
