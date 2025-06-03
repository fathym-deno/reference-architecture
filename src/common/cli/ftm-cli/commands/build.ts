import { z, resolve } from '../../.deps.ts';
import { Command } from '../../fluent/Command.ts';
import { TemplateScaffolder } from '../../.exports.ts';
import { CommandParams } from '../../commands/CommandParams.ts';
import type { TemplateLocator } from '../../TemplateLocator.ts';
import { exists, ensureDir, walk, relative, join } from '../../.deps.ts';

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
    const configPath = await resolveConfigPath(Params, Log);
    await ensureDir(Params.OutDir);

    const embeddedConfigPath = await writeEmbeddedConfig(
      configPath,
      Params.OutDir,
      Log
    );
    const embeddedTemplatesPath = await writeEmbeddedTemplates(
      Params.TemplatesDir,
      Params.OutDir,
      Log
    );

    await scaffoldEmbeddedRuntime(
      Services.Scaffolder,
      Params.OutDir,
      {
        embeddedConfigPath,
        embeddedTemplatesPath,
      },
      Log
    );

    Log.Success(
      '✅ Build complete! Run `deno compile` on _build/cli.ts to finalize.'
    );
  });

async function resolveConfigPath(
  Params: BuildParams,
  Log: any
): Promise<string> {
  const tryPath = Params.ConfigOverride
    ? resolve(Params.ConfigOverride)
    : resolve('./.cli.json');

  if (!(await exists(tryPath))) {
    if (Params.ConfigOverride) {
      Log.Error(`❌ Cannot find .cli.json at: ${tryPath}`);
    } else {
      Log.Error('❌ No .cli.json found in current directory.');
    }

    Log.Info('👉 You can pass one with --config ./path/to/.cli.json');
    Deno.exit(1);
  }

  return tryPath;
}

async function writeEmbeddedConfig(
  configPath: string,
  outDir: string,
  Log: any
): Promise<string> {
  const raw = await Deno.readTextFile(configPath);
  const outputPath = join(outDir, 'embedded-config.json');
  await Deno.writeTextFile(outputPath, raw);
  Log.Info(`📄 Embedded config → ${outputPath}`);
  return outputPath;
}

async function writeEmbeddedTemplates(
  templatesDir: string,
  outDir: string,
  Log: any
): Promise<string> {
  const templates: Record<string, string> = {};

  if (await exists(templatesDir)) {
    for await (const entry of walk(templatesDir, { includeDirs: false })) {
      const rel = relative(templatesDir, entry.path).replace(/\\/g, '/');
      const contents = await Deno.readTextFile(entry.path);
      templates[rel] = contents;
    }
  }

  const outputPath = join(outDir, 'embedded-templates.json');
  await Deno.writeTextFile(outputPath, JSON.stringify(templates, null, 2));
  Log.Info(`📦 Embedded templates → ${outputPath}`);
  return outputPath;
}

async function scaffoldEmbeddedRuntime(
  scaffolder: TemplateScaffolder,
  outputDir: string,
  context: Record<string, string>,
  Log: any
) {
  await scaffolder.Scaffold({
    templateName: 'build-static',
    outputDir,
    context,
  });

  Log.Info(`🧩 Scaffolder rendered build-static template to ${outputDir}`);
}
