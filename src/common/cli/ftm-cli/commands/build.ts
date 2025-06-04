import { pascalCase, resolve, z } from "../../.deps.ts";
import { Command } from "../../fluent/Command.ts";
import { TemplateScaffolder } from "../../.exports.ts";
import { CommandParams } from "../../commands/CommandParams.ts";
import type { TemplateLocator } from "../../TemplateLocator.ts";
import {
  dirname,
  ensureDir,
  exists,
  join,
  relative,
  walk,
} from "../../.deps.ts";
import type { CommandLog } from "../../commands/CommandLog.ts";
import type { CLICommandEntry } from "../../CLICommandEntry.ts";

export const BuildArgsSchema = z.tuple([]);

export const BuildFlagsSchema = z.object({
  config: z
    .string()
    .optional()
    .describe("Path to .cli.json (default: ./.cli.json)"),
  templates: z
    .string()
    .optional()
    .describe("Path to .templates/ folder (default: ./.templates)"),
});

export class BuildParams extends CommandParams<
  z.infer<typeof BuildFlagsSchema>,
  z.infer<typeof BuildArgsSchema>
> {
  get TemplatesDir(): string {
    return this.Flag("templates") ?? "./.templates";
  }

  get ConfigOverride(): string | undefined {
    return this.Flag("config");
  }
}

export default Command("build", "Prepare static CLI build folder")
  .Args(BuildArgsSchema)
  .Flags(BuildFlagsSchema)
  .Params(BuildParams)
  .Services(async (ctx, ioc) => {
    try {
      const { configPath, outDir, configDir, templatesDir } =
        await resolveConfigAndOutDir(ctx.Params);

      const locator = await ioc.Resolve<TemplateLocator>(
        ioc.Symbol("TemplateLocator"),
      );

      return {
        Details: { configPath, outDir, configDir, templatesDir },
        Scaffolder: new TemplateScaffolder(locator, {
          cliOutDir: outDir,
        }),
      };
    } catch (err) {
      ctx.Log.Error((err as Error).message);
      ctx.Log.Info("👉 You can pass one with --config ./path/to/.cli.json");
      Deno.exit(1);
    }
  })
  .Run(async ({ Log, Services }) => {
    const configPath = Services.Details.configPath;
    const configDir = Services.Details.configDir;
    const outDir = Services.Details.outDir;
    const templatesDir = Services.Details.templatesDir;

    await ensureDir(outDir);

    const embeddedTemplatesPath = await collectTemplates(
      templatesDir,
      outDir,
      Log,
    );

    const configRaw = await Deno.readTextFile(configPath);
    const config = JSON.parse(configRaw);
    const baseDir = resolve(configDir, config.Commands ?? "./commands");

    const { imports, modules, commandEntries } = await collectCommandMetadata(
      baseDir,
    );
    const embeddedEntriesPath = await writeCommandEntries(
      commandEntries,
      outDir,
      Log,
    );

    const importInit = (await exists(join(configDir, ".cli.init.ts")))
      ? "../.cli.init.ts"
      : undefined;

    await Services.Scaffolder.Scaffold({
      templateName: "cli-build-static",
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
      `Build complete! Run \`deno compile\` on .build/cli.ts to finalize.`,
    );
  });

async function resolveConfigAndOutDir(params: BuildParams) {
  const configPath = params.ConfigOverride
    ? resolve(params.ConfigOverride)
    : resolve("./.cli.json");

  if (!(await exists(configPath))) {
    throw new Error(`❌ Cannot find .cli.json at: ${configPath}`);
  }

  const configDir = dirname(configPath);

  const outDir = resolve(configDir, "./.build");

  const templatesDir = resolve(
    configDir,
    params.TemplatesDir || "./.templates",
  );

  return { configPath, outDir, configDir, templatesDir };
}

async function collectTemplates(
  templatesDir: string,
  outDir: string,
  log: CommandLog,
): Promise<string> {
  const templates: Record<string, string> = {};

  if (await exists(templatesDir)) {
    for await (const entry of walk(templatesDir, { includeDirs: false })) {
      const rel = relative(templatesDir, entry.path).replace(/\\/g, "/");

      const contents = await Deno.readTextFile(entry.path);

      templates[rel] = contents;
    }
  }

  const outputPath = join(outDir, "embedded-templates.json");

  await Deno.writeTextFile(outputPath, JSON.stringify(templates, null, 2));

  log.Info(`📦 Embedded templates → ${outputPath}`);

  return outputPath;
}

async function collectCommandMetadata(baseDir: string): Promise<{
  imports: { alias: string; path: string }[];
  modules: { key: string; alias: string }[];
  commandEntries: Record<
    string,
    { CommandPath?: string; GroupPath?: string; ParentGroup?: string }
  >;
}> {
  const imports = [];
  const modules = [];
  const commandEntries: Record<string, CLICommandEntry> = {};

  for await (
    const entry of walk(baseDir, {
      includeDirs: false,
      exts: [".ts"],
    })
  ) {
    const rel = relative(baseDir, entry.path).replace(/\\/g, "/");
    const isMeta = entry.name === ".metadata.ts";
    const key = isMeta
      ? rel.replace(/\/\.metadata\.ts$/, "")
      : rel.replace(/\.ts$/, "");
    const group = key.split("/")[0];
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
      imports.push({ alias, path: `../commands/${rel}` });
      modules.push({ key, alias });
    }

    commandEntries[key] = entryData;
  }

  return { imports, modules, commandEntries };
}

async function writeCommandEntries(
  entries: Record<string, unknown>,
  outDir: string,
  log: CommandLog,
): Promise<string> {
  const path = join(outDir, "embedded-command-entries.json");
  await Deno.writeTextFile(path, JSON.stringify(entries, null, 2));
  log.Info(`📘 Embedded command entries → ${path}`);
  return path;
}
