import { getPackageLogger } from "./.deps.ts";

/**
 * Determine if a key exists in a Deno.Kv instance.
 *
 * @param denoKv The Deno.Kv instance.
 * @param key The key to check for existence.
 * @returns true if the key exists, false otherwise.
 */
export async function hasKvEntry(
  denoKv: Deno.Kv,
  key: Deno.KvKey,
): Promise<boolean> {
  const logger = await getPackageLogger(import.meta, "deno-kv");

  try {
    const entry = await denoKv.get(key);

    return !!entry?.value;
  } catch (err) {
    logger.error(
      `There was an issue check deno kv for the entry: ${key.join("|")}`,
      err,
    );

    return false;
  }
}
