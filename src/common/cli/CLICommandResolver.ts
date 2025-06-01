// CLICommandResolver.ts (interface)

import type { Command } from "./.exports.ts";
import type { CLICommandEntry } from "./CLICommandEntry.ts";

/**
 * Interface for resolving commands and loading their modules.
 */
export interface CLICommandResolver {
  /**
   * Resolves all the command modules in the given base directory.
   * Returns a map of command keys to their respective command entries.
   *
   * @param baseDir The base directory where the command modules are located.
   */
  ResolveCommandMap(baseDir: string): Promise<Map<string, CLICommandEntry>>;

  /**
   * Load and resolve the command instance based on the command path and parameters.
   * @param path The path to the command module.
   * @param flags The flags passed to the command.
   * @param args The arguments passed to the command.
   * @returns The loaded command instance.
   */
  LoadCommandInstance(
    path: string,
    flags: Record<string, unknown>,
    args: string[],
  ): Promise<Command>;
}
