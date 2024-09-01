import { dirname, getPackageLogger, getPackageLoggerSync } from "./.deps.ts";
import { exists, existsSync } from "./exists.ts";

/**
 * Creates a directory if it doesn't exist (async). If the directory already exists, no action is taken.
 *
 * @param path The path to create the directory
 *
 * @example From path import
 * ```typescript
 * import { createIfNotExists } from '@fathym/common/path';
 *
 * await createIfNotExists('C:\\temp\\my-directory');
 * ```
 *
 * @example From common import
 * ```typescript
 * import { createIfNotExists } from '@fathym/common';
 *
 * await createIfNotExists('C:\\temp\\my-directory');
 * ```
 */
export async function createIfNotExists(path: string): Promise<void> {
  const logger = await getPackageLogger("path");

  const dir = dirname(path);

  if (dir && !(await exists(dir))) {
    logger.debug(`Ensuring directory ${dir}`);

    Deno.mkdirSync(dir);
  }
}

/**
 * Creates a directory if it doesn't exist (sync). If the directory already exists, no action is taken.
 *
 * @param path The path to create the directory
 *
 * @example From path import
 * ```typescript
 * import { createIfNotExistsSync } from '@fathym/common/path';
 *
 * createIfNotExistsSync('C:\\temp\\my-directory');
 * ```
 *
 * @example From common import
 * ```typescript
 * import { createIfNotExistsSync } from '@fathym/common';
 *
 * createIfNotExistsSync('C:\\temp\\my-directory');
 * ```
 */
export function createIfNotExistsSync(path: string): void {
  const logger = getPackageLoggerSync("path");

  const dir = dirname(path);

  if (dir && !existsSync(dir)) {
    logger.debug(`Ensuring directory ${dir}`);

    Deno.mkdirSync(dir);
  }
}
