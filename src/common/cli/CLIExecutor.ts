import type { CLIConfig } from "./CLIConfig.ts";
import type { Command } from "./commands/Command.ts";
import type { CommandParams } from "./commands/CommandParams.ts";
import type { CommandContext } from "./commands/CommandContext.ts";
import { HelpCommand } from "./HelpCommand.ts";
import type { IoCContainer } from "./.deps.ts";

export interface CLIExecutorOptions {
  key: string;
}

export class CLIExecutor {
  constructor(protected readonly ioc: IoCContainer) {}

  public async Execute(
    config: CLIConfig,
    command: Command<CommandParams> | undefined,
    options: CLIExecutorOptions,
  ): Promise<void> {
    if (!command) return;

    const isHelp = command instanceof HelpCommand;
    const context = this.buildContext(config, command, options);

    try {
      if (!isHelp) {
        context.Log.Info(`🚀 ${config.Name}: running "${options.key}"`);
      }

      const result = await this.runLifecycle(command, context);

      if (typeof result === "number") {
        Deno.exit(result);
      }

      if (!isHelp) {
        context.Log.Success(`✅ ${config.Name}: "${options.key}" completed`);
      }
    } catch (err) {
      context.Log.Error(`💥 Error during "${options.key}" execution:\n`, err);
      Deno.exit(1);
    }
  }

  protected buildContext(
    config: CLIConfig,
    command: Command<CommandParams>,
    opts: CLIExecutorOptions,
  ): CommandContext {
    const log =
      //this.ioc.Resolve<CommandContext["Log"]>("Log") ??
      {
        Info: console.log,
        Warn: console.warn,
        Error: console.error,
        Success: (...args: unknown[]) => console.log("✅", ...args),
      };

    return {
      Config: config,
      Key: opts.key,
      Metadata: command.BuildMetadata(),
      // GroupMetadata: opts.groupMetadata, // TODO: Where to get the parent group for a command, if necessary...
      Log: log,
    };
  }

  protected async runLifecycle(
    cmd: Command,
    ctx: CommandContext,
  ): Promise<void | number> {
    if (typeof cmd.Init === "function") await cmd.Init(ctx, this.ioc);

    const result = typeof cmd.DryRun === "function" && cmd.Params.DryRun
      ? await cmd.DryRun(ctx, this.ioc)
      : await cmd.Run(ctx, this.ioc);

    if (typeof cmd.Cleanup === "function") await cmd.Cleanup(ctx, this.ioc);

    return result;
  }
}
