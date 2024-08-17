/**
 * Helper functions to assist with file paths and directories.
 * @module
 * 
 * @example Exists from direct import
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
 * import { createIfNotExists } from '@fathym/common';
 *
 * await createIfNotExists('C:\\temp\\my-directory');
 * ```
 * 
 * @example New file list request from direct import - All Files
 * ```typescript
 * import { FileListRequest } from '@fathym/common/path';
 *
 * const fileListRequest: FileListRequest = {
 *    Directory: '/path/to/directory',
 * }
 * ```
 * 
 * @example Get file list from common import
 * ```typescript
 * import { getFilesList } from '@fathym/common';
 *
 * const fileList = await getFilesList({
 *   Directory: '/path/to/directory',
 * });
 */
export * from './createIfNotExists.ts';
export * from './exists.ts';
export * from './FileListRequest.ts';
export * from './getFilesList.ts';
