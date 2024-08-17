/**
//  * A series of helper functions to assist with file paths and directories.
 * @module
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
 * import { existsSync } from '@fathym/common';
 *
 * if (existsSync('/path/to/file.txt')) {
 *  console.log('File exists');
 * }
 * ```
 */

export * from './exists.ts';
