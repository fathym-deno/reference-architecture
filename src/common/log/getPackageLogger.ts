import {
  type DenoConfig,
  getLogger,
  type Logger,
  parseJsonc,
  pathJoin,
} from "./.deps.ts";

export async function getPackageLogger(
  importMeta: ImportMeta,
  path?: string,
): Promise<Logger> {
  const denoJsoncPath = pathJoin(importMeta.url, "./deno.jsonc");

  const denoJsoncStr = await Deno.readTextFile(denoJsoncPath);

  const denoConfig = parseJsonc(denoJsoncStr) as DenoConfig;

  let name = denoConfig?.name;

  if (path) {
    name = name ? `${name}/${path}` : path;
  }

  return getLogger(name);
}
