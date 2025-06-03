import { relative, resolve, toFileUrl, walk, type ZodSchema } from "./.deps.ts";
import {
  type CLIInitFn,
  type CommandModuleMetadata,
  type CommandParamConstructor,
  CommandRuntime,
} from "./.exports.ts";
import type { CLICommandEntry } from "./CLICommandEntry.ts";
import type { CommandModule } from "./commands/CommandModule.ts";
import { FileSystemTemplateLocator } from "./FileSystemTemplateLocator.ts";
import { CommandModuleBuilder } from "./fluent/CommandModuleBuilder.ts";
import type { TemplateLocator } from "./TemplateLocator.ts";

/**
 * Default CLI resolver for loading commands and their metadata/runtime.
 */
export class CLICommandResolver {
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

  public async LoadCommandInstance(path: string): Promise<{
    ArgsSchema?: ZodSchema;
    Command: CommandRuntime;
    FlagsSchema?: ZodSchema;
    Params?: CommandParamConstructor;
  }> {
    let mod = (await import(toFileUrl(path).href)).default;

    if (mod instanceof CommandModuleBuilder) {
      mod = mod.Build();
    }

    const Cmd = mod?.Command;

    if (Cmd && typeof Cmd === "function") {
      const cmdMod = mod as CommandModule;

      const inst = new Cmd();
      return {
        Command: inst,
        Params: cmdMod.Params,
        ArgsSchema: cmdMod.ArgsSchema,
        FlagsSchema: cmdMod.FlagsSchema,
      };
    }

    return {
      Command: new (class extends CommandRuntime {
        public Run(): void {
          throw new Error(
            "This is a metadata-only command and cannot be executed.",
          );
        }

        public override BuildMetadata(): CommandModuleMetadata {
          const m = mod as unknown as CommandModuleMetadata;
          return this.buildMetadataFromSchemas(m.Name, m.Description);
        }
      })(),
      Params: undefined,
      ArgsSchema: undefined,
      FlagsSchema: undefined,
    };
  }

  public async ResolveInitFn(path: string): Promise<CLIInitFn | undefined> {
    if (path) {
      const mod = (await import(toFileUrl(path).href)).default;

      return mod as CLIInitFn;
    }
  }

  public ResolveTemplateLocator(
    baseTemplatesDir?: string,
  ): Promise<TemplateLocator | undefined> {
    return Promise.resolve(
      baseTemplatesDir
        ? new FileSystemTemplateLocator(baseTemplatesDir)
        : undefined,
    );
  }
}
