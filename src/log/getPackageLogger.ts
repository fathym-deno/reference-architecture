import {
  type DenoConfig,
  getLogger,
  type Logger,
  parseJsonc,
  // type pathJoin,
} from "./.deps.ts";

export async function getPackageLogger(
  importMeta: ImportMeta,
  path?: string,
): Promise<Logger> {
  const moduleUrl = new URL(importMeta.url);

  const moduleDir = moduleUrl.pathname.substring(
    0,
    moduleUrl.pathname.lastIndexOf("/"),
  );

  const denoJsonPath = `${moduleDir}/deno.json`;

  const denoJsoncStr = await Deno.readTextFile(denoJsonPath);

  const denoConfig = parseJsonc(denoJsoncStr) as DenoConfig;

  let name = denoConfig?.name;

  if (path) {
    name = name ? `${name}/${path}` : path;
  }

  return getLogger(name);
}

export function getPackageLoggerSync(
  importMeta: ImportMeta,
  path?: string,
): Logger {
  const moduleUrl = new URL(importMeta.url);

  const moduleDir = moduleUrl.pathname.substring(
    0,
    moduleUrl.pathname.lastIndexOf("/"),
  );

  const denoJsonPath = `${moduleDir}/deno.json`;

  const denoJsoncStr = Deno.readTextFileSync(denoJsonPath);

  const denoConfig = parseJsonc(denoJsoncStr) as DenoConfig;

  let name = denoConfig?.name;

  if (path) {
    name = name ? `${name}/${path}` : path;
  }

  return getLogger(name);
}
