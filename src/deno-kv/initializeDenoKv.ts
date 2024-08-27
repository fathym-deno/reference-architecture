import { exists, getPackageLogger, path } from "./.deps.ts";

/**
 * Initialize Deno.Kv instance.
 *
 * @param denoKvPath The path for the DenoKV file.
 * @returns A Deno.Kv instance.
 */
export async function initializeDenoKv(denoKvPath?: string): Promise<Deno.Kv> {
  const logger = await getPackageLogger(import.meta);

  logger.debug(`Initializing DenoKV at ${denoKvPath}`);

  if (
    denoKvPath &&
    !denoKvPath.startsWith("https") &&
    !(await exists(denoKvPath))
  ) {
    const denoKvDir = path.dirname(denoKvPath);

    if (denoKvDir && !(await exists(denoKvDir))) {
      logger.debug(`Ensuring DenoKV directory ${denoKvDir}`);

      try {
        await Deno.mkdir(denoKvDir);
      } catch (err) {
        logger.warn(
          `There was an issure ensuring the directory: ${denoKvDir}`,
          err,
        );
      }
    }
  }

  logger.debug(`Loading DenoKV instance for ${denoKvPath}`);

  const kv = await Deno.openKv(denoKvPath);

  logger.debug(`Inititialized DenoKV database: ${denoKvPath || "$default"}`);

  return kv;
}
