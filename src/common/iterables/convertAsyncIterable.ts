/**
 * Convert an async iterable to an async iterable of another type.
 *
 * @param source The incoming iterable to convert
 * @param converter The method to use for converting the item.
 * @returns The async iterable of converted items.
 *
 * @example From direct import
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
 *
 * @example From common import
 * import { convertAsyncIterable } from '@fathym/common';
 *
 * const ai = await convertAsyncIterable(asyncIterable, async (i) => i * 2);
 *
 * console.log(Array.from(ai)); // [0, 2, 4, 6]
 */
export async function* convertAsyncIterable<T, R>(
  source: AsyncIterable<T>,
  converter: (item: T) => Promise<R>,
): AsyncIterable<R> {
  for await (const item of source) {
    const convertedItem = await converter(item);

    yield convertedItem;
  }
}
