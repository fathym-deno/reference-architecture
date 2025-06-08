// deno-lint-ignore-file no-explicit-any
import type { CLIConfig } from "./types/CLIConfig.ts";
import type { IoCContainer } from "./.deps.ts";

import type { CommandRuntime } from "./commands/CommandRuntime.ts";
import type {
  CommandContext,
  CommandInvokerMap,
} from "./commands/CommandContext.ts";
import {
  type CommandParamConstructor,
  CommandParams,
} from "./commands/CommandParams.ts";

import { HelpCommand } from "./help/HelpCommand.ts";
import type { CLICommandResolver } from "./CLICommandResolver.ts";
import { CLIDFSContextManager } from "./CLIDFSContextManager.ts";

/**
 * Options provided when executing a CLI command.
 * These are derived during the parsing + resolution phase.
 */
export interface CLICommandExecutorOptions {
  /** Fully resolved command key (e.g. 'init', 'schema/promote') */
  key: string;

  /** Parsed named flags (e.g., --config ./foo.json) */
  flags: Record<string, unknown>;

  /** Parsed positional arguments (e.g., ['run', 'foo']) */
  positional: string[];

  /** The command’s param constructor (from `.Params(...)`) */
  paramsCtor: CommandParamConstructor<any, any, any> | undefined;

  /** Optional template base directory */
  baseTemplatesDir: string | undefined;

  /**
   * Optional subcommand invokers — if this command was defined with `.Commands(...)`,
   * this is the map of callable `(flags, args?) => Promise<void>` handlers.
   */
  commands?: CommandInvokerMap;
}

/**
 * CLICommandExecutor is the runtime orchestrator that prepares
 * and runs a single command — handling logging, params, services,
 * and lifecycle phases (Init, Run, DryRun, Cleanup).
 */
export class CLICommandExecutor {
  constructor(
    protected readonly ioc: IoCContainer,
    protected resolver: CLICommandResolver,
  ) {}

  /**
   * Execute a resolved command instance with the given options.
   * Responsible for logging, context preparation, and error handling.
   */
  public async Execute(
    config: CLIConfig,
    command: CommandRuntime | undefined,
    options: CLICommandExecutorOptions,
  ): Promise<void> {
    if (!command) return;

    const isHelp = command instanceof HelpCommand;
    const context = await this.buildContext(config, command, options);

    try {
      if (!isHelp) {
        context.Log.Info(`🚀 ${config.Name}: running "${options.key}"`);
      }

      const result = await this.runLifecycle(command, context);

      if (typeof result === "number") {
        Deno.exit(result);
      }

      if (!isHelp) {
        context.Log.Success(`${config.Name}: "${options.key}" completed`);
      }
    } catch (err) {
      context.Log.Error(`💥 Error during "${options.key}" execution:\n`, err);
      Deno.exit(1);
    }
  }

  /**
   * Constructs a fully populated CommandContext, including CLI metadata,
   * logging, parameter class, resolved commands map (if present), and hydrated services.
   */
  protected async buildContext(
    config: CLIConfig,
    command: CommandRuntime,
    opts: CLICommandExecutorOptions,
  ): Promise<CommandContext> {
    const log = {
      Info: (...data: any[]) => console.info(data),
      Warn: (...data: any[]) => console.warn(data),
      Error: (...data: any[]) => console.error(data),
      Success: (...args: unknown[]) => console.log("✅", ...args),
    };

    const { flags, positional, paramsCtor } = opts;

    const params = paramsCtor
      ? new paramsCtor(positional, flags)
      : new (class extends CommandParams<unknown[], Record<string, unknown>> {
        constructor() {
          super(positional, flags);
        }
      })();

    const dfsCtxMgr = await this.ioc.Resolve(CLIDFSContextManager);

    const tempLocator = await this.resolver.ResolveTemplateLocator(
      await dfsCtxMgr.GetProjectDFS(),
    );

    if (tempLocator) {
      this.ioc.Register(() => tempLocator, {
        Type: this.ioc.Symbol("TemplateLocator"),
      });
    }

    const baseContext: CommandContext = {
      ArgsSchema: undefined,
      FlagsSchema: undefined,
      Config: config,
      GroupMetadata: undefined,
      Key: opts.key,
      Log: log,
      Metadata: command.BuildMetadata(),
      Params: params,
      Services: {},
      Commands: opts.commands ?? undefined, // <-- NEW
    };

    return await command.ConfigureContext(baseContext, this.ioc);
  }

  /**
   * Executes the full command lifecycle in the following order:
   * 1. Init (if present)
   * 2. Run or DryRun (based on `--dry-run`)
   * 3. Cleanup (if present)
   *
   * Expects already hydrated context (via `buildContext()`).
   */
  protected async runLifecycle(
    cmd: CommandRuntime,
    ctx: CommandContext,
  ): Promise<number | void> {
    if (typeof cmd.Init === "function") {
      await cmd.Init(ctx, this.ioc);
    }

    const result = typeof cmd.DryRun === "function" && ctx.Params.DryRun
      ? await cmd.DryRun(ctx, this.ioc)
      : await cmd.Run(ctx, this.ioc);

    if (typeof cmd.Cleanup === "function") {
      await cmd.Cleanup(ctx, this.ioc);
    }

    return result;
  }
}
