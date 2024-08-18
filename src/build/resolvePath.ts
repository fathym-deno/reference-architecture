/**
 * Resolves a path using the provided resolver function.
 *
 * @param resolve A function that resolves a path.
 * @param path A path to resolve.
 * @returns The resolved path for the given path.
 *
 * @example From direct import
 * ```typescript
 * import { resolvePath } from '@fathym/common/build';
 *
 * const path = resolvePath('./src/common/.exports.ts', import.meta.resolve);
 * ```
 */
export function resolvePath(
  path: string,
  resolve: (path: string) => string,
): string {
  return resolve(path);
}
