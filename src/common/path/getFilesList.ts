import type { FileListInput } from "./FileListInput.ts";

export async function getFilesList(
  input: FileListInput,
  meta?: ImportMeta,
): Promise<string[]> {
  const foundFiles: string[] = [];

  let dirPath = meta?.resolve(input.Directory).replace("file:///", "") ||
    input.Directory;

  // Fix for builds on GitHub Actions
  if (dirPath.startsWith("home")) {
    dirPath = `/${dirPath}`;
  }

  for await (const fileOrFolder of Deno.readDir(dirPath)) {
    if (fileOrFolder.isDirectory) {
      // If it's not ignored, recurse and search this folder for files.
      const nestedFiles = await getFilesList(
        {
          Directory: `${input.Directory}${fileOrFolder.name}/`,
          Extensions: input.Extensions,
        },
        meta,
      );

      foundFiles.push(...nestedFiles);
    } else {
      // We found a file, so store it.
      foundFiles.push(`${input.Directory}${fileOrFolder.name}`);
    }
  }

  return foundFiles.filter((ff) =>
    input.Extensions ? input.Extensions.some((ext) => ff.endsWith(ext)) : ff
  );
}
