import { toFileUrl } from "./.deps.ts";

export async function loadModuleMetadata(path: string) {
  const mod = await import(toFileUrl(path).href);

  return mod?.default?.BuildMetadata();
}
