/**
 * Determine if a path exists.
 *
 * @param path The path to check for existence.
 * @returns If the path exists.
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);

    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw error;
    }
  }
}

