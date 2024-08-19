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
  try {
    const entry = await denoKv.get(key);

    return !!entry?.value;
  } catch (err) {
    console.error(err);

    return false;
  }
}
