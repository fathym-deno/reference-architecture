/**
 * Helper functions to assist with file paths and directories.
 * @module
 * 
 * @example Exists From direct import
 * ```typescript
 * import { exists } from '@fathym/common/path';
 *
 * if (await exists('/path/to/file.txt')) {
 *  console.log('File exists');
 * }
 * ```
 * 
 * @example Create if not exists From common import
 * ```typescript
 * import { createIfNotExists } from '@fathym/common';
 *
 * await createIfNotExists('C:\\temp\\my-directory');
 * ```
 */
export * from './createIfNotExists.ts';
export * from './exists.ts';
export * from './FileListInput.ts';
export * from './getFilesList.ts';
