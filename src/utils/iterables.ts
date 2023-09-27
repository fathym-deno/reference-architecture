
export async function* convertAsyncIterable<T, R>(
  source: AsyncIterable<T>,
  converter: (item: T) => Promise<R>
): AsyncIterable<R> {
  for await(const item of source) {
    const convertedItem = await converter(item);

    yield convertedItem;
  }
}
