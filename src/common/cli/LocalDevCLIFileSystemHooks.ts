import { walk, relative, resolve, join, exists, toFileUrl } from './.deps.ts';
import type { CLICommandEntry } from './CLICommandEntry.ts';
import type { CLIInitFn } from './CLIInitFn.ts';
import type { CLIConfig } from './CLIConfig.ts';
import type { CommandModule } from './commands/CommandModule.ts';
import { FileSystemTemplateLocator } from './FileSystemTemplateLocator.ts';
import { CommandModuleBuilder } from './fluent/CommandModuleBuilder.ts';
import type { TemplateLocator } from './TemplateLocator.ts';
import type { CLIFileSystemHooks } from './CLIFileSystemHooks.ts';

export class LocalDevCLIFileSystemHooks implements CLIFileSystemHooks {
  async ResolveCommandEntryPaths(
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

  async ResolveConfig(
    configPath: string
  ): Promise<{ config: CLIConfig; resolvedPath: string }> {
    let resolvedPath = resolve(configPath);
    let configText: string | undefined;

    try {
      configText = await Deno.readTextFile(resolvedPath);
    } catch {
      const fallbackPath = join(Deno.cwd(), '.cli.json');

      if (await exists(fallbackPath)) {
        resolvedPath = fallbackPath;
        configText = await Deno.readTextFile(resolvedPath);
      } else {
        console.error(
          `❌ Unable to load CLI config.\n` +
            `🧐 Tried: '${configPath}' and fallback '.cli.json'\n\n` +
            `👉 Options:\n` +
            `   - Create a .cli.json\n` +
            `   - Or pass path: deno run -A cli.ts ./path/to/.cli.json\n`
        );
        Deno.exit(1);
      }
    }

    const config = JSON.parse(configText) as CLIConfig;
    return { config, resolvedPath: resolve(resolvedPath) };
  }

  async LoadCommandModule(path: string): Promise<CommandModule> {
    let mod = (await import(toFileUrl(path).href)).default;
    if (mod instanceof CommandModuleBuilder) mod = mod.Build();
    return mod as CommandModule;
  }

  async LoadInitFn(path: string): Promise<CLIInitFn | undefined> {
    const mod = (await import(toFileUrl(path).href)).default;
    return mod as CLIInitFn;
  }

  ResolveTemplateLocator(dir?: string): Promise<TemplateLocator | undefined> {
    return Promise.resolve(
      dir ? new FileSystemTemplateLocator(dir) : undefined
    );
  }
}
