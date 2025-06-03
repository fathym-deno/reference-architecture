import type { CLIFileSystemHooks } from "./CLIFileSystemHooks.ts";
import { LocalDevCLIFileSystemHooks } from "./LocalDevCLIFileSystemHooks.ts";
import { CommandRuntime, type CommandModuleMetadata } from "./.exports.ts";

export class CLICommandResolver {
  constructor(
    protected readonly hooks: CLIFileSystemHooks = new LocalDevCLIFileSystemHooks()
  ) {}

  public ResolveCommandMap(dir: string) {
    return this.hooks.ResolveCommandEntryPaths(dir);
  }

  public async LoadCommandInstance(path: string) {
    const mod = await this.hooks.LoadCommandModule(path);
    const Cmd = mod?.Command;

    if (Cmd && typeof Cmd === "function") {
      return {
        Command: new Cmd(),
        Params: mod.Params,
        ArgsSchema: mod.ArgsSchema,
        FlagsSchema: mod.FlagsSchema,
      };
    }

    return {
      Command: new (class extends CommandRuntime {
        public Run() {
          throw new Error("This is a metadata-only command and cannot be executed.");
        }

        public override BuildMetadata(): CommandModuleMetadata {
          const m = mod as unknown as CommandModuleMetadata;
          return this.buildMetadataFromSchemas(m.Name, m.Description);
        }
      })(),
    };
  }

  public ResolveConfig(configPath: string) {
    return this.hooks.ResolveConfig(configPath);
  }

  public ResolveInitFn(path: string) {
    return this.hooks.LoadInitFn(path);
  }

  public ResolveTemplateLocator(baseTemplatesDir?: string) {
    return this.hooks.ResolveTemplateLocator(baseTemplatesDir);
  }
}
