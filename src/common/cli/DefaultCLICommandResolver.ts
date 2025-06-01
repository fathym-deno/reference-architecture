import { walk, relative, resolve } from './.deps.ts';
import { toFileUrl } from './.deps.ts';
import {
  CommandParams,
  type CommandModuleMetadata,
  type Command,
  type CLICommandResolver,
} from './.exports.ts';
import type { CLICommandEntry } from './CLICommandEntry.ts';

/**
 * Default implementation for resolving commands and loading their modules.
 * This class is responsible for resolving the commands, groups, and metadata.
 */
export class DefaultCLICommandResolver implements CLICommandResolver {
  /**
   * Resolves all the command modules in the given base directory.
   * Returns a map of command keys to their respective command entries.
   *
   * @param baseDir The base directory where the command modules are located.
   * @returns A map of command keys to their respective command entries, where the key is the command or group name.
   */
  public async ResolveCommandMap(
    baseDir: string
  ): Promise<Map<string, CLICommandEntry>> {
    const map = new Map<string, CLICommandEntry>();

    // Walk through the base directory and resolve all command modules
    for await (const entry of walk(baseDir, {
      includeDirs: false,
      exts: ['.ts'],
    })) {
      const rel = relative(baseDir, entry.path)
        .replace(/\\/g, '/')
        .replace(/\/index$/, ''); // Allow folders with index.ts

      const isMetadata = entry.name === '.metadata.ts';

      const key = isMetadata
        ? rel.replace(/\/\.metadata\.ts$/, '')
        : rel.replace(/\.ts$/, '');

      const absPath = resolve(entry.path);
      const group = key.split('/')[0]; // Group is the first part of the path

      // Initialize or get the existing entry
      let entryData = map.get(key) || {
        CommandPath: undefined,
        GroupPath: undefined,
        ParentGroup: group !== key ? group : undefined,
      };

      // If it's a metadata file, set GroupPath and augment if necessary
      if (isMetadata) {
        entryData.GroupPath = absPath; // Set GroupPath to the .metadata.ts file path
      } else {
        // Otherwise, it's a command file, so set the CommandPath
        entryData.CommandPath = absPath;
      }

      // Store or update the entry in the map
      map.set(key, entryData);
    }

    return map;
  }

  /**
   * Load and resolve the command instance based on the command path and parameters.
   * @param path The path to the command module.
   * @param flags The flags passed to the command.
   * @param args The arguments passed to the command.
   * @returns The loaded command instance.
   */
  public async LoadCommandInstance(
    path: string,
    flags: Record<string, unknown>,
    args: string[]
  ): Promise<Command> {
    const mod = (await import(toFileUrl(path).href)).default; // Load the module
    const Cmd = mod?.Command;

    if (Cmd && typeof Cmd === 'function') {
      const CmdParams = mod.Params;
      const params = CmdParams
        ? new CmdParams(flags, args)
        : new (class extends CommandParams<Record<string, unknown>, unknown[]> {
            constructor() {
              super(flags, args);
            }
          })();

      return new Cmd(params);
    } else {
      return {
        BuildMetadata() {
          return mod as unknown as CommandModuleMetadata;
        },
      } as Command;
    }
  }
}
