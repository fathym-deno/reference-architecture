import {
  type DenoConfig,
  getLogger,
  type Logger,
  parseJsonc,
  resolvePackageRoot,
  // type pathJoin,
} from "./.deps.ts";

export async function getPackageLogger(
  importMeta: ImportMeta,
  path?: string,
): Promise<Logger> {
  let name;

  try {
    const packageRoot = resolvePackageRoot(importMeta);

    if (packageRoot) {
      const denoJsonPath = `${packageRoot}/deno.jsonc`;

      const denoJsoncStr = await Deno.readTextFile(denoJsonPath);

      const denoConfig = parseJsonc(denoJsoncStr) as DenoConfig;

      let name = denoConfig?.name;

      if (path) {
        name = name ? `${name}/${path}` : path;
      }
    } else {
      name = "@fathym/default";
    }
  } catch {
    name = "@fathym/default";
  }

  return getLogger(name);
}

export function getPackageLoggerSync(
  importMeta: ImportMeta,
  path?: string,
): Logger {
  let name;

  try {
    const packageRoot = resolvePackageRoot(importMeta);

    if (packageRoot) {
      const denoJsonPath = `${packageRoot}/deno.jsonc`;

      const denoJsoncStr = Deno.readTextFileSync(denoJsonPath);

      const denoConfig = parseJsonc(denoJsoncStr) as DenoConfig;

      name = denoConfig?.name;

      if (path) {
        name = name ? `${name}/${path}` : path;
      }
    } else {
      name = "@fathym/default";
    }
  } catch {
    name = "@fathym/default";
  }

  return getLogger(name);
}
