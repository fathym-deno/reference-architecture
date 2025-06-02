import { z } from "../../.deps.ts";
import {
  Command,
  type CommandContext,
  CommandParams,
  defineCommandModule,
  TemplateScaffolder,
} from "../../.exports.ts";

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

export class InitCommand extends Command<InitParams> {
  constructor(params: InitParams) {
    super(params, InitArgsSchema, InitFlagsSchema);
  }

  public override async Run(ctx: CommandContext): Promise<void | number> {
    const { Name, Template, BaseTemplatesDir } = this.Params;

    const scaffolder = new TemplateScaffolder({
      templateRoot: BaseTemplatesDir!,
      context: { name: Name },
    });

    await scaffolder.Scaffold(Template, Name);

    ctx.Log.Success(
      `✅ Project "${Name}" created from "${Template}" template.`,
    );
  }

  public override BuildMetadata() {
    return this.buildMetadataFromSchemas(
      "Init",
      "Initialize a new CLI project",
    );
  }
}

export default defineCommandModule({
  FlagsSchema: InitFlagsSchema,
  ArgsSchema: InitArgsSchema,
  Command: InitCommand,
  Params: InitParams,
});
