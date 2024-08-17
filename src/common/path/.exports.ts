// /**
//  * @module
//  *
//  * A series of helper functions to assist with file paths and directories.
//  *
//  * @example
//  * ```typescript
//  * import { exists } from '@fathym/common/path';
//  *
//  * if (await exists('/path/to/file.txt')) {
//  *  console.log('File exists');
//  * }
//  * ```
//  *
//  * @example
//  * ```typescript
//  * import { existsSync } from '@fathym/common';
//  *
//  * if (existsSync('/path/to/file.txt')) {
//  *  console.log('File exists');
//  * }
//  * ```
//  */
/**
 * Lower level `transform` functionality that's used by the CLI
 * to convert Deno code to Node code.
 * @module
 */

export * from './exists.ts';