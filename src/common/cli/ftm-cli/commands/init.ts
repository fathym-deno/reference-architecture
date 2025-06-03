import { z } from "../../.deps.ts";
import { Command } from "../../fluent/Command.ts";
import { TemplateScaffolder } from "../../.exports.ts";
import { CommandParams } from "../../commands/CommandParams.ts";
import type { TemplateLocator } from "../../TemplateLocator.ts";

// --- Schemas ---
export const InitArgsSchema = z.tuple([z.string().describe("Project name")]);

export const InitFlagsSchema = z.object({
  template: z
    .string()
    .optional()
    .describe("Template to use (e.g. hello, web, api)"),

  baseTemplatesDir: z
    .string()
    .optional()
    .describe("Root directory for templates (default injected by CLI)"),
});

// --- Params Class ---
export class InitParams extends CommandParams<
  z.infer<typeof InitFlagsSchema>,
  z.infer<typeof InitArgsSchema>
> {
  get Name(): string {
    const arg = this.Arg(0);
    return !arg || arg === "." ? "." : arg;
  }

  get Template(): string {
    return this.Flag("template") ?? "hello";
  }

  get BaseTemplatesDir(): string | undefined {
    return this.Flag("baseTemplatesDir");
  }
}

export default Command("init", "Initialize a new CLI project")
  .Args(InitArgsSchema)
  .Flags(InitFlagsSchema)
  .Params(InitParams)
  .Services(async (ctx, ioc) => ({
    Scaffolder: new TemplateScaffolder(
      await ioc.Resolve<TemplateLocator>(ioc.Symbol("TemplateLocator")),
      { name: ctx.Params.Name },
    ),
  }))
  .Run(async ({ Params, Log, Services }) => {
    const { Name, Template } = Params;
    const { Scaffolder } = Services;

    await Scaffolder.Scaffold({
      templateName: Template,
      outputDir: Name,
    });

    Log.Success(`✅ Project "${Name}" created from "${Template}" template.`);
  });
