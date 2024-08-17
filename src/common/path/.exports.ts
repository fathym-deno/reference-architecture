/**
 * Helper functions to assist with file paths and directories.
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
 * @example Create if not exists from common import
 * ```typescript
 * import { exists } from '@fathym/common';
 *
 * await createIfNotExists('C:\\temp\\my-directory');
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
export * from './createIfNotExists.ts';
export * from './exists.ts';
export * from './FileListInput.ts';
export * from './getFilesList.ts';
