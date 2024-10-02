import { join } from "./.deps.ts";

export function resolvePackageRoot(importMeta: ImportMeta): string {
  // Resolve the current file path
  let currentDir = new URL(".", importMeta.url).pathname.slice(1);

  console.log(currentDir);

  // Traverse up to find the root, assuming 'deno.json' or 'deno.jsonc' is in the root of the package
  while (true) {
    // Construct the possible paths for deno.json and deno.jsonc
    const denoJsonPath = join(currentDir, "deno.json");
    const denoJsoncPath = join(currentDir, "deno.jsonc");

    // Check if either deno.json or deno.jsonc exists
    try {
      if (Deno.statSync(denoJsonPath).isFile) {
        return currentDir;
      }
    } catch (_error) {
      try {
        if (Deno.statSync(denoJsoncPath).isFile) {
          return currentDir;
        }
      } catch (_error) {
        // Ignore the error if the file doesn't exist at this level
      }
    }

    // Navigate up one directory level
    const parentDir = new URL("..", `file:///${currentDir}`).pathname.slice(1);

    // Stop if we reach the root directory without finding the package root
    if (parentDir === currentDir) {
      throw new Error(
        "Could not find deno.json or deno.jsonc in any parent directory.",
      );
    }

    currentDir = parentDir;
  }
}
