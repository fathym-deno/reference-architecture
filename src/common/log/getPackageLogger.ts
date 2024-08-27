import {
  type DenoConfig,
  getLogger,
  type Logger,
  parseJsonc,
  // type pathJoin,
} from "./.deps.ts";

export async function getPackageLogger(
  _importMeta: ImportMeta,
  path?: string,
): Promise<Logger> {
  // const denoJsoncPath = pathJoin(importMeta.url, "./deno.jsonc");

  const denoJsoncStr = await Deno.readTextFile("./deno.jsonc");

  const denoConfig = parseJsonc(denoJsoncStr) as DenoConfig;

  let name = denoConfig?.name;

  if (path) {
    name = name ? `${name}/${path}` : path;
  }

  return getLogger(name);
}
