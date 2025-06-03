import type { CLIConfig } from "./CLIConfig.ts";
import type { CommandRuntime } from "./commands/CommandRuntime.ts";
import {
  type CommandParamConstructor,
  CommandParams,
} from "./commands/CommandParams.ts";
import type { CommandContext } from "./commands/CommandContext.ts";
import type { IoCContainer } from "./.deps.ts";
import { HelpCommand } from "./HelpCommand.ts";
import type { TemplateLocator } from "./TemplateLocator.ts";

export interface CLIExecutorOptions {
  key: string;
  flags: Record<string, unknown>;
  positional: string[];
  paramsCtor: CommandParamConstructor | undefined;
  templates: TemplateLocator | undefined;
}

export class CLIExecutor {
  constructor(protected readonly ioc: IoCContainer) {}

  public async Execute(
    config: CLIConfig,
    command: CommandRuntime | undefined,
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
    command: CommandRuntime,
    opts: CLIExecutorOptions,
  ): CommandContext {
    const log = {
      Info: console.log,
      Warn: console.warn,
      Error: console.error,
      Success: (...args: unknown[]) => console.log("✅", ...args),
    };

    const { flags, positional, paramsCtor } = opts;

    const params = paramsCtor
      ? new paramsCtor(flags, positional)
      : new (class extends CommandParams<Record<string, unknown>, unknown[]> {
        constructor() {
          super(flags, positional);
        }
      })();

    return {
      Config: config,
      GroupMetadata: undefined, // Future: include from commandMap/group chain
      Key: opts.key,
      Log: log,
      Metadata: command.BuildMetadata(),
      Params: params,
      Services: {},
    };
  }

  protected async runLifecycle(
    cmd: CommandRuntime,
    ctx: CommandContext,
  ): Promise<void | number> {
    if (typeof cmd.Init === "function") await cmd.Init(ctx, this.ioc);

    const result = typeof cmd.DryRun === "function" && ctx.Params.DryRun
      ? await cmd.DryRun(ctx, this.ioc)
      : await cmd.Run(ctx, this.ioc);

    if (typeof cmd.Cleanup === "function") await cmd.Cleanup(ctx, this.ioc);

    return result;
  }
}
