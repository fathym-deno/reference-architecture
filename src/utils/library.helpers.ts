export function loadMetaUrl(path: string): string {
  return import.meta.resolve(path);
}
