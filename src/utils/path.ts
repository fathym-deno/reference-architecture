export type FileListInput = {
  Directory: string;

  Extensions?: string[];
};

export async function getFilesList(
  input: FileListInput,
): Promise<string[]> {
  const foundFiles: string[] = [];

  let dirPath = import.meta.resolve(input.Directory).replace("file:///", "");

  // Fix for builds on GitHub Actions
  if (dirPath.startsWith("home")) {
    dirPath = `/${dirPath}`;
  }

  for await (const fileOrFolder of Deno.readDir(dirPath)) {
    if (fileOrFolder.isDirectory) {
      // If it's not ignored, recurse and search this folder for files.
      const nestedFiles = await getFilesList({
        Directory: `${input.Directory}/${fileOrFolder.name}`,
        Extensions: input.Extensions,
      });
      foundFiles.push(...nestedFiles);
    } else {
      // We found a file, so store it.
      foundFiles.push(`${input.Directory}/${fileOrFolder.name}`);
    }
  }

  return foundFiles.filter((ff) =>
    input.Extensions ? input.Extensions.some((ext) => ff.endsWith(ext)) : ff
  );
}

/**
 * Determine if a path exists.
 *
 * @param path The path to check for existence.
 * @returns If the path exists.
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);

    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw error;
    }
  }
}

/**
 * Determine if a path exists sync.
 *
 * @param path The path to check for existence.
 * @returns If the path exists.
 */
export function existsSync(path: string): boolean {
  try {
    Deno.statSync(path);

    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw error;
    }
  }
}
