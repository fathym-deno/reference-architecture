/**
 * Convert an async iterable to an async iterable of another type.
 * 
 * @source The incoming iterable to convert
 * @converter The method to use for converting the item.
 * @return The async iterable of converted items.
 * 
 * @example From direct import
 * 
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
