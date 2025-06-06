import { z } from "../../.deps.ts";
import { Command } from "../../fluent/Command.ts";
import { TemplateScaffolder } from "../../.exports.ts";
import { CommandParams } from "../../commands/CommandParams.ts";
import type { TemplateLocator } from "../../templates/TemplateLocator.ts";
import { CLIDFSContextManager } from "../../CLIDFSContextManager.ts";

// --- Schemas ---
const InitArgsSchema = z.tuple([
  z.string().optional().describe("Project name"),
]);

const InitFlagsSchema = z.object({
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

// --- Params Class ---
class InitParams extends CommandParams<
  z.infer<typeof InitArgsSchema>,
  z.infer<typeof InitFlagsSchema>
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
  .Services(async (ctx, ioc) => {
    const dfsCtxMgr = await ioc.Resolve(CLIDFSContextManager);

    return {
      Scaffolder: new TemplateScaffolder(
        await ioc.Resolve<TemplateLocator>(ioc.Symbol("TemplateLocator")),
        await dfsCtxMgr.GetDFS("execution"),
        { name: ctx.Params.Name },
      ),
      DFSContextManager: dfsCtxMgr,
    };
  })
  .Run(async ({ Params, Log, Services }) => {
    const { Name, Template } = Params;
    const { Scaffolder } = Services;

    await Scaffolder.Scaffold({
      templateName: Template,
      outputDir: Name,
    });

    const fullPath = await Services.Scaffolder.DFS.ResolvePath(Name);

    Log.Success(`Project created from "${Template}" template.`);
    Log.Info(`📂 Initialized at: ${fullPath}`);
  });
