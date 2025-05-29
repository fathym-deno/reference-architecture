import { resolve, relative, walk } from './.deps.ts';
import { toFileUrl } from './.deps.ts';
import {
  CommandParams,
  type CommandModuleMetadata,
  type Command,
} from './.exports.ts';
import type { CLICommandEntry } from './CLICommandEntry.ts';
import type { CLIResolvedEntry } from './CLIResolvedEntry.ts';

/**
 * Class responsible for resolving commands and loading their modules.
 */
export class CLICommandResolver {
  /**
   * Resolves all the command modules in the given base directory.
   * Returns a map of command keys to their respective module and metadata entries.
   *
   * @param baseDir The base directory where the command modules are located.
   */
  public async ResolveCommandMap(
    baseDir: string
  ): Promise<Map<string, CLIResolvedEntry>> {
    const map = new Map<string, CLIResolvedEntry>();

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
      const group = key.split('/')[0];

      const tuple = map.get(key) ?? [];
      const record: CLICommandEntry = { Path: absPath, Group: group };

      if (isMetadata) {
        tuple[1] = record;
      } else {
        if (tuple[0]) {
          console.warn(`⚠️ Duplicate command key detected: "${key}"`);
          continue;
        }
        tuple[0] = record;
      }

      map.set(key, tuple);
    }

    return map;
  }

  /**
   * Load and resolve command instance based on the command path and parameters.
   * @param path The path to the command module.
   * @param flags Flags passed to the command.
   * @param args Arguments passed to the command.
   */
  public async LoadCommandInstance(
    path: string,
    flags: Record<string, unknown>,
    args: string[]
  ) {
    const mod = await import(toFileUrl(path).href); // Load the module
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
