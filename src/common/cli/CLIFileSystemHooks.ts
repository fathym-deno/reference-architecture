import type { CLICommandEntry } from "./types/CLICommandEntry.ts";
import type { CLIInitFn } from "./types/CLIInitFn.ts";
import type { CLIConfig } from "./types/CLIConfig.ts";
import type { CommandModule } from "./commands/CommandModule.ts";
import type { TemplateLocator } from "./templates/TemplateLocator.ts";

export interface CLIFileSystemHooks {
  ResolveCommandEntryPaths(
    baseCommandDir: string,
  ): Promise<Map<string, CLICommandEntry>>;
  ResolveConfig(args: string[]): Promise<{
    config: CLIConfig;
    resolvedPath: string;
    remainingArgs: string[];
  }>;
  LoadInitFn(
    path: string,
  ): Promise<{ initFn: CLIInitFn | undefined; resolvedInitPath: string }>;
  LoadCommandModule(path: string): Promise<CommandModule>;
  ResolveTemplateLocator(
    baseTemplatesDir?: string,
  ): Promise<TemplateLocator | undefined>;
}
