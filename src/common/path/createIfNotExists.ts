import { dirname } from "../../src.deps.ts";
import { exists, existsSync } from "./exists.ts";
/**
 * Creates a directory if it doesn't exist (async). If the directory already exists, no action is taken.
 *
 * @param path The path to create the directory
 *
 * @example From common import
 * ```typescript
 * import { exists } from '@fathym/common';
 *
 * await createIfNotExists('C:\\temp\\my-directory');
 * ```
 */
export async function createIfNotExists(path: string): Promise<void> {
  const dir = dirname(path);

  if (dir && !(await exists(dir))) {
    console.log(`Ensuring directory ${dir}`);

    Deno.mkdirSync(dir);
  }
}

/**
 * Creates a directory if it doesn't exist (sync). If the directory already exists, no action is taken.
 *
 * @param path The path to create the directory
 *
 * @example From common import
 * ```typescript
 * import { createIfNotExistsSync } from '@fathym/common';
 *
 * createIfNotExistsSync('C:\\temp\\my-directory');
 * ```
 */
export function createIfNotExistsSync(path: string): void {
  const dir = dirname(path);

  if (dir && !existsSync(dir)) {
    console.log(`Ensuring directory ${dir}`);

    Deno.mkdirSync(dir);
  }
}
