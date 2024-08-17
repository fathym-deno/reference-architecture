/**
 * A series of helper functions to assist with file paths and directories.
 * @module
 *
 * @example Exists from path import
 * ```typescript
 * import { exists } from '@fathym/common/path';
 *
 * if (await exists('/path/to/file.txt')) {
 *  console.log('File exists');
 * }
 * ```
 *
 * @example Sync exists from common import
 * ```typescript
 * import { existsSync } from '@fathym/common';
 *
 * if (existsSync('/path/to/file.txt')) {
 *  console.log('File exists');
 * }
 * ```
 */

export * from './exists.ts';
