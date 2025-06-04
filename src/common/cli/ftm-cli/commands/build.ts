import { pascalCase, resolve, z } from '../../.deps.ts';
import { Command } from '../../fluent/Command.ts';
import { TemplateScaffolder } from '../../.exports.ts';
import { CommandParams } from '../../commands/CommandParams.ts';
import type { TemplateLocator } from '../../TemplateLocator.ts';
import {
  ensureDir,
  exists,
  join,
  relative,
  walk,
  dirname,
} from '../../.deps.ts';

export const BuildArgsSchema = z.tuple([]);

export const BuildFlagsSchema = z.object({
  config: z
    .string()
    .optional()
    .describe('Path to .cli.json (default: ./.cli.json)'),
  templates: z
    .string()
    .optional()
    .describe('Path to .templates/ folder (default: ./.templates)'),
  outDir: z
    .string()
    .optional()
    .describe('Output build folder (default: ./_build)'),
});

export class BuildParams extends CommandParams<
  z.infer<typeof BuildFlagsSchema>,
  z.infer<typeof BuildArgsSchema>
> {
  get TemplatesDir(): string {
    return resolve(this.Flag('templates') ?? './.templates');
  }

  get OutDir(): string {
    return resolve(this.Flag('outDir') ?? './_build');
  }

  get ConfigOverride(): string | undefined {
    return this.Flag('config');
  }
}

export default Command('build', 'Prepare static CLI build folder')
  .Args(BuildArgsSchema)
  .Flags(BuildFlagsSchema)
  .Params(BuildParams)
  .Services(async (ctx, ioc) => {
    const locator = await ioc.Resolve<TemplateLocator>(
      ioc.Symbol('TemplateLocator')
    );

    return {
      Scaffolder: new TemplateScaffolder(locator, {
        cliOutDir: ctx.Params.OutDir,
      }),
    };
  })
  .Run(async ({ Params, Log, Services }) => {
    const configPath = Params.ConfigOverride
      ? resolve(Params.ConfigOverride)
      : resolve('./.cli.json');

    if (!(await exists(configPath))) {
      Log.Error(`❌ Cannot find .cli.json at: ${configPath}`);
      Log.Info('👉 You can pass one with --config ./path/to/.cli.json');
      Deno.exit(1);
    }

    const configDir = dirname(configPath);
    const outDir = Params.OutDir;

    // Clean output dir
    if (await exists(outDir)) {
      await Deno.remove(outDir, { recursive: true });
      Log.Info(`🧹 Cleared previous build output at ${outDir}`);
    }

    await ensureDir(outDir);

    // Collect templates
    const templates: Record<string, string> = {};
    const templatesDir = Params.TemplatesDir;

    if (await exists(templatesDir)) {
      for await (const entry of walk(templatesDir, { includeDirs: false })) {
        const rel = relative(templatesDir, entry.path).replace(/\\/g, '/');
        const contents = await Deno.readTextFile(entry.path);
        templates[rel] = contents;
      }
    }

    const embeddedTemplatesPath = join(outDir, 'embedded-templates.json');
    await Deno.writeTextFile(
      embeddedTemplatesPath,
      JSON.stringify(templates, null, 2)
    );
    Log.Info(`📦 Embedded templates → ${embeddedTemplatesPath}`);

    // Collect command metadata and imports
    const configRaw = await Deno.readTextFile(configPath);
    const config = JSON.parse(configRaw);
    const baseDir = resolve(configDir, config.Commands ?? './commands');

    const imports: { alias: string; path: string }[] = [];
    const modules: { key: string; alias: string }[] = [];
    const commandEntries: Record<
      string,
      { CommandPath?: string; GroupPath?: string; ParentGroup?: string }
    > = {};

    for await (const entry of walk(baseDir, {
      includeDirs: false,
      exts: ['.ts'],
    })) {
      const rel = relative(baseDir, entry.path).replace(/\\/g, '/');
      const isMeta = entry.name === '.metadata.ts';
      const key = isMeta
        ? rel.replace(/\/\.metadata\.ts$/, '')
        : rel.replace(/\.ts$/, '');

      const group = key.split('/')[0];
      const alias = `${pascalCase(key)}Command`;

      const entryData = commandEntries[key] ?? {
        CommandPath: undefined,
        GroupPath: undefined,
        ParentGroup: group !== key ? group : undefined,
      };

      if (isMeta) {
        entryData.GroupPath = entry.path;
      } else {
        entryData.CommandPath = entry.path;

        imports.push({
          alias,
          path: `../commands/${rel}`, // ← use full relative path directly
        });

        modules.push({ key, alias });
      }

      commandEntries[key] = entryData;
    }

    const embeddedEntriesPath = join(outDir, 'embedded-command-entries.json');
    await Deno.writeTextFile(
      embeddedEntriesPath,
      JSON.stringify(commandEntries, null, 2)
    );
    Log.Info(`📘 Embedded command entries → ${embeddedEntriesPath}`);

    const importInit = (await exists(join(configDir, '.cli.init.ts')))
      ? '../.cli.init.ts'
      : undefined;

    // Scaffold everything via TemplateScaffolder
    await Services.Scaffolder.Scaffold({
      templateName: 'cli-build-static',
      outputDir: outDir,
      context: {
        embeddedTemplatesPath,
        embeddedEntriesPath,
        imports,
        modules,
        importInitFn: importInit,
      },
    });

    Log.Info(`🧩 Scaffolder rendered build-static template to ${outDir}`);
    Log.Success(
      '✅ Build complete! Run `deno compile` on _build/cli.ts to finalize.'
    );
  });
