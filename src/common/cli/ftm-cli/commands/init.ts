import { z } from '../../.deps.ts';
import { Command } from '../../fluent/Command.ts';
import { TemplateScaffolder } from '../../.exports.ts';
import { CommandParams } from '../../commands/CommandParams.ts';

// --- Schemas ---
export const InitArgsSchema = z.tuple([z.string().describe('Project name')]);

export const InitFlagsSchema = z.object({
  template: z
    .string()
    .optional()
    .describe('Template to use (e.g. hello, web, api)'),

  baseTemplatesDir: z
    .string()
    .optional()
    .describe('Root directory for templates (default injected by CLI)'),
});

// --- Params Class ---
export class InitParams extends CommandParams<
  z.infer<typeof InitFlagsSchema>,
  z.infer<typeof InitArgsSchema>
> {
  get Name(): string {
    const arg = this.Arg(0);
    return !arg || arg === '.' ? '.' : arg;
  }

  get Template(): string {
    return this.Flag('template') ?? 'hello';
  }

  get BaseTemplatesDir(): string | undefined {
    return this.Flag('baseTemplatesDir');
  }
}

export default Command('init', 'Initialize a new CLI project')
  .Args(InitArgsSchema)
  .Flags(InitFlagsSchema)
  .Params(InitParams)
  .Run(async ({ Params, Log }) => {
    const { Name, Template, BaseTemplatesDir } = Params;

    const scaffolder = new TemplateScaffolder({
      templateRoot: BaseTemplatesDir!,
      context: { name: Name },
    });

    await scaffolder.Scaffold(Template, Name);

    Log.Success(`✅ Project "${Name}" created from "${Template}" template.`);
  });
