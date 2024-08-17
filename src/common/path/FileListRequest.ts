/**
 * Represents a request for files in a directory based on the given extensions.
 *
 * @example From direct import - All Files
 * ```typescript
 * import { FileListRequest } from '@fathym/common/path';
 *
 * const fileListRequest: FileListRequest = {
 *    Directory: '/path/to/directory',
 * }
 * ```
 *
 * @example From common import - TS and TSX files
 * ```typescript
 * import { FileListRequest } from '@fathym/common';
 *
 * const fileListRequest: FileListRequest = {
 *    Directory: '/path/to/directory',
 *    Extensions: ['ts', '.tsx'],
 * }
 * ```
 */
export type FileListRequest = {
  /**
   * The directory where the files are located.
   */
  Directory: string;

  /**
   * The extensions of the files to include in the list. If not provided, all files will be included.
   */
  Extensions?: string[];
};
