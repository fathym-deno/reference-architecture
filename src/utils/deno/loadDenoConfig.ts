import { parseJsonc, pathJoin } from "../../src.deps.ts";
import type { DenoConfig } from "./DenoConfig.ts";

export async function loadDenoConfig(
  denoCfgPath?: string,
): Promise<DenoConfig> {
  const denoJsonPath = pathJoin(Deno.cwd(), denoCfgPath || "./deno.jsonc");

  const denoJsonsStr = await Deno.readTextFile(denoJsonPath);

  return parseJsonc(denoJsonsStr) as DenoConfig;
}

export function loadDenoConfigSync(denoCfgPath?: string): DenoConfig {
  const denoJsonPath = pathJoin(Deno.cwd(), denoCfgPath || "./deno.jsonc");

  const denoJsonsStr = Deno.readTextFileSync(denoJsonPath);

  return parseJsonc(denoJsonsStr) as DenoConfig;
}
