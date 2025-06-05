import { exists, join, relative, resolve, toFileUrl, walk } from './.deps.ts';
import type { CLICommandEntry } from './CLICommandEntry.ts';
import type { CLIInitFn } from './CLIInitFn.ts';
import type { CLIConfig } from './CLIConfig.ts';
import type { CommandModule } from './commands/CommandModule.ts';
import { FileSystemTemplateLocator } from './FileSystemTemplateLocator.ts';
import { CommandModuleBuilder } from './fluent/CommandModuleBuilder.ts';
import type { TemplateLocator } from './TemplateLocator.ts';
import type { CLIFileSystemHooks } from './CLIFileSystemHooks.ts';

export class LocalDevCLIFileSystemHooks implements CLIFileSystemHooks {
  public async ResolveCommandEntryPaths(
    baseDir: string
  ): Promise<Map<string, CLICommandEntry>> {
    const map = new Map<string, CLICommandEntry>();

    for await (const entry of walk(baseDir, {
      includeDirs: false,
      exts: ['.ts'],
    })) {
      const rel = relative(baseDir, entry.path)
        .replace(/\\/g, '/')
        .replace(/\/index$/, '');
      const key =
        entry.name === '.metadata.ts'
          ? rel.replace(/\/\.metadata\.ts$/, '')
          : rel.replace(/\.ts$/, '');

      const absPath = resolve(entry.path);
      const group = key.split('/')[0];

      const entryData = map.get(key) || {
        CommandPath: undefined,
        GroupPath: undefined,
        ParentGroup: group !== key ? group : undefined,
      };

      if (entry.name === '.metadata.ts') entryData.GroupPath = absPath;
      else entryData.CommandPath = absPath;

      map.set(key, entryData);
    }

    return map;
  }

  public async ResolveConfig(args: string[]): Promise<{
    config: CLIConfig;
    resolvedPath: string;
    remainingArgs: string[];
  }> {
    let configPath: string | undefined;
    let remainingArgs = args;

    if (args[0]?.endsWith('.json') && (await exists(args[0]))) {
      configPath = args[0];
      remainingArgs = args.slice(1);
    } else {
      const fallback = join(Deno.cwd(), '.cli.json');
      if (await exists(fallback)) {
        configPath = fallback;
      } else {
        console.error(
          `❌ Unable to locate CLI config.\n` +
            `🧐 Tried: first arg and fallback '.cli.json'\n` +
            `👉 Create one or pass path explicitly.\n`
        );
        Deno.exit(1);
      }
    }

    const resolvedPath = resolve(configPath!);
    const configText = await Deno.readTextFile(resolvedPath);
    const config = JSON.parse(configText) as CLIConfig;

    return { config, resolvedPath, remainingArgs };
  }

  public async LoadCommandModule(path: string): Promise<CommandModule> {
    let mod = (await import(toFileUrl(path).href)).default;
    if (mod instanceof CommandModuleBuilder) mod = mod.Build();
    return mod as CommandModule;
  }

  public async LoadInitFn(
    initPath: string
  ): Promise<{ initFn: CLIInitFn | undefined; resolvedInitPath: string }> {
    const resolvedInitPath = toFileUrl(initPath).href;

    const mod = (await import(resolvedInitPath)).default;

    return { initFn: mod as CLIInitFn, resolvedInitPath };
  }

  public ResolveTemplateLocator(dir?: string): Promise<TemplateLocator | undefined> {
    return Promise.resolve(
      dir ? new FileSystemTemplateLocator(dir) : undefined
    );
  }
}
