/**
 * Determine if a path exists (async).
 *
 * @param path The path to check for existence.
 * @returns Return true if the path exists.
 *
 * @example
 * ```typescript
 * import { exists } from '@fathym/common/path';
 *
 * if (await exists('/path/to/file.txt')) {
 *  console.log('File exists');
 * }
 * ```
 *
 * @example
 * ```typescript
 * import { exists } from '@fathym/common';
 *
 * if (await exists('/path/to/file.txt')) {
 *  console.log('File exists');
 * }
 * ```
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);

    return true;
  } catch {
    return false;
    //   if (error instanceof Deno.errors.NotFound) {
    //   return false;
    // } else {
    //   throw error;
    // }
  }
}

/**
 * Determine if a path exists (sync).
 *
 * @param path The path to check for existence.
 * @returns Return true if the path exists.
 *
 * @example
 * ```typescript
 * import { existsSync } from '@fathym/common/path';
 *
 * if (existsSync('/path/to/file.txt')) {
 *  console.log('File exists');
 * }
 * ```
 *
 * @example
 * ```typescript
 * import { existsSync } from '@fathym/common';
 *
 * if (existsSync('/path/to/file.txt')) {
 *  console.log('File exists');
 * }
 * ```
 */
export function existsSync(path: string): boolean {
  try {
    Deno.statSync(path);

    return true;
  } catch {
    return false;
    //   if (error instanceof Deno.errors.NotFound) {
    //   return false;
    // } else {
    //   throw error;
    // }
  }
}
