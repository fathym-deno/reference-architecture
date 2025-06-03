import { relative, resolve, walk } from "./.deps.ts";
import { toFileUrl } from "./.deps.ts";
import {
  type CLICommandResolver,
  type CommandModuleMetadata,
  CommandParams,
  CommandRuntime,
} from "./.exports.ts";
import type { CLICommandEntry } from "./CLICommandEntry.ts";

/**
 * Default implementation for resolving commands and loading their modules.
 * This class is responsible for resolving the commands, groups, and metadata.
 */
export class DefaultCLICommandResolver implements CLICommandResolver {
  /**
   * Resolves all the command modules in the given command directory.
   *
   * @param baseCommandDir The base directory where command modules are stored.
   * @returns A map of command tokens to their associated command/group paths.
   */
  public async ResolveCommandMap(
    baseCommandDir: string,
  ): Promise<Map<string, CLICommandEntry>> {
    const map = new Map<string, CLICommandEntry>();

    for await (
      const entry of walk(baseCommandDir, {
        includeDirs: false,
        exts: [".ts"],
      })
    ) {
      const rel = relative(baseCommandDir, entry.path)
        .replace(/\\/g, "/")
        .replace(/\/index$/, "");

      const isMetadata = entry.name === ".metadata.ts";

      const key = isMetadata
        ? rel.replace(/\/\.metadata\.ts$/, "")
        : rel.replace(/\.ts$/, "");

      const absPath = resolve(entry.path);
      const group = key.split("/")[0];

      const entryData = map.get(key) || {
        CommandPath: undefined,
        GroupPath: undefined,
        ParentGroup: group !== key ? group : undefined,
      };

      if (isMetadata) {
        entryData.GroupPath = absPath;
      } else {
        entryData.CommandPath = absPath;
      }

      map.set(key, entryData);
    }

    return map;
  }

  /**
   * Dynamically loads a command instance from a given module file path.
   *
   * @param path Path to the command module.
   * @param flags CLI flags.
   * @param args CLI positional args.
   */
  public async LoadCommandInstance(
    path: string,
    flags: Record<string, unknown>,
    args: string[],
  ): Promise<CommandRuntime> {
    const mod = (await import(toFileUrl(path).href)).default;
    const Cmd = mod?.Command;

    if (Cmd && typeof Cmd === "function") {
      const CmdParams = mod.Params;
      const params = CmdParams
        ? new CmdParams(flags, args)
        : new (class extends CommandParams<Record<string, unknown>, unknown[]> {
          constructor() {
            super(flags, args);
          }
        })();

      return new Cmd(params);
    }

    return new (class extends CommandRuntime {
      constructor() {
        super(
          new (class extends CommandParams<Record<string, unknown>, unknown[]> {
            constructor() {
              super({}, []);
            }
          })(),
        );
      }

      public Run(): void {
        throw new Error(
          "This is a metadata-only command and cannot be executed.",
        );
      }

      public override BuildMetadata(): CommandModuleMetadata {
        const m = mod as unknown as CommandModuleMetadata;
        return this.buildMetadataFromSchemas(m.Name, m.Description);
      }
    })();
  }
}
