import { exists, path } from "./.deps.ts";

/**
 * Initialize Deno.Kv instance.
 *
 * @param denoKvPath The path for the DenoKV file.
 * @returns A Deno.Kv instance.
 */
export async function initializeDenoKv(denoKvPath?: string): Promise<Deno.Kv> {
  console.log(`Initializing DenoKV at ${denoKvPath}`);

  if (
    denoKvPath &&
    !denoKvPath.startsWith("https") &&
    !(await exists(denoKvPath))
  ) {
    const denoKvDir = path.dirname(denoKvPath);

    if (denoKvDir && !(await exists(denoKvDir))) {
      console.log(`Ensuring DenoKV directory ${denoKvDir}`);

      Deno.mkdirSync(denoKvDir);
    }
  }

  console.log(`Loading DenoKV instance for ${denoKvPath}`);

  const kv = await Deno.openKv(denoKvPath);

  console.log(`Inititialized DenoKV database: ${denoKvPath || "$default"}`);

  return kv;
}
