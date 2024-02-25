export function loadMetaUrl(
  resolve: (specifier: string) => string,
  path: string,
): string {
  return resolve(path);
}

export function loadRefArchMetaUrl(path: string): string {
  return loadMetaUrl(import.meta.resolve, path);
}
