import { z } from '../../.deps.ts';
import { Command } from '../../fluent/Command.ts';
import { CommandParams } from '../../commands/CommandParams.ts';
import { CLIDFSContextManager } from '../../CLIDFSContextManager.ts';
import { CLI } from '../../.exports.ts';

export const RunArgsSchema = z
  .tuple([z.string()])
  .rest(z.string())
  .describe('Arguments to forward to the CLI');

export const RunFlagsSchema = z
  .object({
    config: z
      .string()
      .optional()
      .describe('Path to .cli.json (default: execution context)'),
  })
  .passthrough(); // Accept any additional flags

export class RunParams extends CommandParams<
  z.infer<typeof RunArgsSchema>,
  z.infer<typeof RunFlagsSchema>
> {
  get ConfigPath(): string | undefined {
    return this.Flag('config');
  }

  get ForwardedArgs(): string[] {
    return this.Args;
  }

  get ForwardedFlags(): string[] {
    return Object.entries(this.Flags)
      .filter(([key]) => key !== 'config') // Don't forward internal flags
      .map(([key, val]) => `--${key}=${val}`);
  }
}

export default Command('run', 'Run a specific command in a CLI project')
  .Args(RunArgsSchema)
  .Flags(RunFlagsSchema)
  .Params(RunParams)
  .Services(async (ctx, ioc) => {
    const dfsCtx = await ioc.Resolve(CLIDFSContextManager);

    if (ctx.Params.ConfigPath) {
      await dfsCtx.RegisterProjectDFS(ctx.Params.ConfigPath, 'CLI');
    }

    const cli = new CLI({});

    return {
      CLI: cli,
      CLIDFS: ctx.Params.ConfigPath
        ? await dfsCtx.GetDFS('CLI')
        : await dfsCtx.GetExecutionDFS(),
    };
  })
  .Run(async ({ Params, Log, Services }) => {
    const entryPath = await Services.CLIDFS.ResolvePath(`./.cli.json`);

    const cliArgs = [entryPath, ...Params.ForwardedArgs, ...Params.ForwardedFlags];

    Log.Info(`🚀 Running CLI`);
    Log.Info(`→ With args: ${cliArgs.join(' ')}`);

    try {
      await Services.CLI.RunFromArgs(cliArgs);
    } catch (e) {
      const err = e as Error;

      Log.Error(`❌ Failed to run CLI.\n${err.stack || err.message}`);
      Deno.exit(1);
    }

    Log.Success('🎉 CLI run completed');
  });
