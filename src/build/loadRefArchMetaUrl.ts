import { resolvePath } from "./resolvePath.ts";

/**
 * Use to load the full path relative to the reference architecture module.
 *
 * @param path The path to the reference architecture module relative to the root of the project.
 * @returns The full path relative to the reference architecture module.
 *
 * @example From direct import
 * ```typescript
 * import { loadRefArchMetaUrl } from '@fathym/common/build';
 *
 * const metaUrl = loadRefArchMetaUrl('./src/common/.exports.ts');
 * ```
 */
export function loadRefArchMetaUrl(path: string): string {
  return resolvePath(path, import.meta.resolve);
}
