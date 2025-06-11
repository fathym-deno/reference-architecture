import { type DFSFileHandler, toFileUrl } from "../.deps.ts";
import { runCommandWithLogs } from "./runCommandWithLogs.ts";
import type { CommandLog } from "../commands/CommandLog.ts";

/**
 * Dynamically imports a module from a DFS.
 * If compiled, bundles .ts files to JS via `deno bundle` and loads via Blob URL.
 */
export async function importModule(
  log: CommandLog,
  filePath: string,
  rootDFS: DFSFileHandler,
  buildDFS: DFSFileHandler,
): Promise<unknown> {
  const isCompiled = !Deno.execPath().endsWith("deno");

  if (filePath.endsWith(".ts")) {
    if (isCompiled) {
      // Get the relative path from workspace root to preserve structure
      const fileName = filePath.replace(/\.ts$/, "");

      const fullFilePath = rootDFS.ResolvePath(filePath);

      const buildPath = buildDFS.ResolvePath(`${fileName}.js`);

      await log.Info(`📦 Bundling '${fullFilePath}' → '${buildPath}'`);

      // Call deno bundle to emit JS to the build path
      await runCommandWithLogs(["bundle", fullFilePath, buildPath], log);

      // Read and execute via Blob
      const jsCode = await buildDFS.GetFileInfo(filePath);

      const blob = new Blob([await new Response(jsCode?.Contents).text()], {
        type: "application/javascript",
      });

      const jsURL = URL.createObjectURL(blob);

      queueMicrotask(() => {
        buildDFS.RemoveFile(filePath).catch(() => {
          log.Error(`Failed to delete temp build file at ${filePath}`);
        });
      });

      return await import(jsURL);
    }

    // In dev, just import directly from file
    return await import(toFileUrl(filePath).href);
  }

  // Already a JS file — no bundling needed
  return await import(toFileUrl(filePath).href);
}
