import { dirname, join } from "./.deps.ts";

export function resolvePackageRoot(importMeta: ImportMeta): string {
  // Resolve the current file path
  let currentDir = new URL(".", importMeta.url).pathname;

  // Remove the leading slash for Windows compatibility
  if (Deno.build.os === "windows" && currentDir.startsWith("/")) {
    currentDir = currentDir.slice(1);
  }

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
    const parentDir = dirname(currentDir);

    // Stop if we reach the root directory without finding the package root
    if (parentDir === currentDir) {
      currentDir = `@fathym/default`;

      return currentDir;
    }

    currentDir = parentDir;
  }
}
