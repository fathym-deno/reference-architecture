import {
  type DenoConfig,
  getLogger,
  type Logger,
  parseJsonc,
} from "./.deps.ts";

export async function getPackageLogger(
  importMeta: ImportMeta,
): Promise<Logger> {
  const denoJsoncPath = importMeta.resolve("deno.jsonc");

  const denoJsoncStr = await Deno.readTextFile(denoJsoncPath);

  const denoConfig = parseJsonc(denoJsoncStr) as DenoConfig;

  return getLogger(denoConfig.name);
}

export function getPackageLoggerSync(
  importMeta: ImportMeta,
): Logger {
  const denoJsoncPath = importMeta.resolve("deno.jsonc");

  const denoJsoncStr = Deno.readTextFileSync(denoJsoncPath);

  const denoConfig = parseJsonc(denoJsoncStr) as DenoConfig;

  return getLogger(denoConfig.name);
}
