import { dirname } from "../../src.deps.ts";
import { existsSync } from "./exists.ts";

/**
 * Creates a directory if it doesn't exist. If the directory already exists, no action is taken.
 *
 * @param path The path to create the directory
 *
 * @example
 */
export function createIfNotExists(path: string): void {
  const dir = dirname(path);

  if (dir && !existsSync(dir)) {
    console.log(`Ensuring directory ${dir}`);

    Deno.mkdirSync(dir);
  }
}
