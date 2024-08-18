import type { FileListRequest } from "./FileListRequest.ts";

/**
 * Retrieves a list of files in the specified directory, optionally filtering by extension. Use the meta to give the file list current context.
 *
 * @param flReq The request for the file list.
 * @param meta The meta to give the file list current context.
 * @returns The list of files in the specified directory, optionally filtered by extension.
 *
 * @example From direct import
 * ```typescript
 * import { getFilesList } from '@fathym/common/path';
 *
 * const fileList = await getFilesList({
 *   Directory: '/path/to/directory',
 * });
 * ```
 *
 * @example From common import - With Meta and Extensions
 * ```typescript
 * import { getFilesList } from '@fathym/common';
 *
 * const fileList = await getFilesList({
 *   Directory: '/path/to/directory',
 *   Extensions: ['.txt', '.js'],
 * }, import.meta);
 * ```
 */
export async function getFilesList(
  flReq: FileListRequest,
  meta?: ImportMeta,
): Promise<string[]> {
  const foundFiles: string[] = [];

  let dirPath = meta?.resolve(flReq.Directory).replace("file:///", "") ||
    flReq.Directory;

  // Fix for builds on GitHub Actions
  if (dirPath.startsWith("home")) {
    dirPath = `/${dirPath}`;
  }

  for await (const fileOrFolder of Deno.readDir(dirPath)) {
    if (fileOrFolder.isDirectory) {
      // If it's not ignored, recurse and search this folder for files.
      const nestedFiles = await getFilesList(
        {
          Directory: `${flReq.Directory}${fileOrFolder.name}/`,
          Extensions: flReq.Extensions,
        },
        meta,
      );

      foundFiles.push(...nestedFiles);
    } else {
      // We found a file, so store it.
      foundFiles.push(`${flReq.Directory}${fileOrFolder.name}`);
    }
  }

  flReq.Extensions =
    flReq.Extensions?.map((ext) =>
      ext.startsWith(".") ? ext.slice(1).toLowerCase() : ext.toLowerCase()
    ) || [];

  return foundFiles.filter((ff) =>
    flReq.Extensions?.length
      ? flReq.Extensions.some((ext) => ff.endsWith(ext))
      : ff
  );
}
