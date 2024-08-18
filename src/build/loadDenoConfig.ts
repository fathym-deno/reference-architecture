import { exists, existsSync, parseJsonc, pathJoin } from "./.deps.ts";
import type { DenoConfig } from "./DenoConfig.ts";

/**
 * Loads the deno configuration file and returns the DenoConfig object.
 *
 * @param denoCfgPath The path to the deno.jsonc file. Default to "./deno.json" or "./deno.jsonc".
 * @returns A denoConfig object.
 *
 * @example From direct import
 * ```typescript
 * import { loadDenoConfig } from '@fathym/common/build';
 *
 * const { Config, DenoConfigPath } = await loadDenoConfig();
 * ```
 *
 * @example From common import
 * ```typescript
 * import { loadDenoConfig } from '@fathym/common';
 *
 * const { Config, DenoConfigPath } = await loadDenoConfig();
 * ```
 */
export async function loadDenoConfig(
  denoCfgPath?: string,
): Promise<{ Config: DenoConfig; DenoConfigPath: string }> {
  denoCfgPath = denoCfgPath ||
    ((await exists("deno.jsonc")) ? "deno.jsonc" : "deno.json");

  if (!(await exists(denoCfgPath))) {
    throw new Deno.errors.NotFound(denoCfgPath);
  }

  const denoJsonPath = pathJoin(Deno.cwd(), denoCfgPath);

  const denoJsonsStr = await Deno.readTextFile(denoJsonPath);

  return {
    Config: parseJsonc(denoJsonsStr) as DenoConfig,
    DenoConfigPath: denoCfgPath,
  };
}

/**
 * Loads the deno configuration file synchronously and returns the DenoConfig object.
 *
 * @param denoCfgPath The path to the deno.jsonc file. Default to "./deno.jsonc" or "./deno.json".
 * @returns A denoConfig object.
 *
 * @example From direct import
 * ```typescript
 * import { loadDenoConfigSync } from '@fathym/common/build';
 *
 * const { Config, DenoConfigPath } = loadDenoConfigSync();
 * ```
 *
 * @example From common import
 * ```typescript
 * import { loadDenoConfigSync } from '@fathym/common';
 *
 * const { Config, DenoConfigPath } = loadDenoConfigSync();
 * ```
 */
export function loadDenoConfigSync(denoCfgPath?: string): {
  Config: DenoConfig;
  DenoConfigPath: string;
} {
  denoCfgPath = denoCfgPath ||
    (existsSync("deno.jsonc") ? "deno.jsonc" : "deno.json");

  if (!existsSync(denoCfgPath)) {
    throw new Deno.errors.NotFound(denoCfgPath);
  }
  const denoJsonPath = pathJoin(Deno.cwd(), denoCfgPath);

  const denoJsonsStr = Deno.readTextFileSync(denoJsonPath);

  return {
    Config: parseJsonc(denoJsonsStr) as DenoConfig,
    DenoConfigPath: denoCfgPath,
  };
}
