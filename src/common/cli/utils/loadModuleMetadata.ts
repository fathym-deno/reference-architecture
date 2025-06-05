import { toFileUrl } from "../.deps.ts";
import type { CommandModuleMetadata } from "../commands/CommandModuleMetadata.ts";

export async function loadModuleMetadata(
  path: string,
): Promise<CommandModuleMetadata> {
  const mod = await import(toFileUrl(path).href);

  return mod?.default?.BuildMetadata();
}
