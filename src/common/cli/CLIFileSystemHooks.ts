import type { CLICommandEntry } from './CLICommandEntry.ts';
import type { CLIInitFn } from './CLIInitFn.ts';
import type { CLIConfig } from './CLIConfig.ts';
import type { CommandModule } from './commands/CommandModule.ts';
import type { TemplateLocator } from './TemplateLocator.ts';

export interface CLIFileSystemHooks {
  ResolveCommandEntryPaths(
    baseCommandDir: string
  ): Promise<Map<string, CLICommandEntry>>;
  ResolveConfig(
    configPath: string
  ): Promise<{ config: CLIConfig; resolvedPath: string }>;
  LoadInitFn(path: string): Promise<CLIInitFn | undefined>;
  LoadCommandModule(path: string): Promise<CommandModule>;
  ResolveTemplateLocator(
    baseTemplatesDir?: string
  ): Promise<TemplateLocator | undefined>;
}
