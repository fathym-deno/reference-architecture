// deno-lint-ignore-file no-explicit-any ban-types
import type { ZodType } from "../.deps.ts";
import type { IoCContainer } from "../.deps.ts";

import type { CommandModule } from "../commands/CommandModule.ts";
import type { CommandContext } from "../commands/CommandContext.ts";
import type {
  CommandParamConstructor,
  CommandParams,
} from "../commands/CommandParams.ts";

import { CommandRuntime } from "../commands/CommandRuntime.ts";
import { CLICommandExecutor } from "../CLICommandExecutor.ts";
import type { CommandInvokerMap } from "../commands/CommandContext.ts";
import { CLICommandResolver } from "../CLICommandResolver.ts";

type UsedKeys = Record<string, true>;

type RemoveUsed<T, Used extends UsedKeys> = Omit<T, keyof Used>;

export type ExtractInvokerMap<T extends Record<string, CommandModule>> = {
  [K in keyof T]: T[K] extends CommandModule<infer A, infer F, any>
    ? (args?: A, flags?: F) => Promise<void | number>
    : (
      args?: unknown[],
      flags?: Record<string, unknown>,
    ) => Promise<void | number>;
};

export class CommandModuleBuilder<
  TArgs extends unknown[] = unknown[],
  TFlags extends Record<string, unknown> = Record<string, unknown>,
  TParams extends CommandParams<TArgs, TFlags> = CommandParams<TArgs, TFlags>,
  TServices extends Record<string, unknown> = Record<string, unknown>,
  TCommands extends CommandInvokerMap = CommandInvokerMap,
  TUsed extends UsedKeys = {},
> {
  protected argsSchema?: ZodType<TArgs>;
  protected flagsSchema?: ZodType<TFlags>;
  protected runFn?: (
    ctx: CommandContext<TParams, TServices, TCommands>,
  ) => void | number | Promise<void | number>;
  protected initFn?: (
    ctx: CommandContext<TParams, TServices, TCommands>,
  ) => void | Promise<void>;
  protected cleanupFn?: (
    ctx: CommandContext<TParams, TServices, TCommands>,
  ) => void | Promise<void>;
  protected dryRunFn?: (
    ctx: CommandContext<TParams, TServices, TCommands>,
  ) => void | number | Promise<void | number>;
  protected servicesFactory?: (
    ctx: CommandContext<TParams, TServices, TCommands>,
    ioc: IoCContainer,
  ) => Promise<TServices>;
  protected subcommands?: Record<
    string,
    CommandModule<unknown[], Record<string, unknown>>
  >;
  protected paramsCtor?: CommandParamConstructor<TArgs, TFlags, TParams>;

  constructor(
    protected readonly name: string,
    protected readonly description: string,
  ) {}

  public Args<NextArgs extends unknown[]>(
    schema: ZodType<NextArgs>,
  ): RemoveUsed<
    CommandModuleBuilder<
      NextArgs,
      TFlags,
      CommandParams<NextArgs, TFlags>,
      TServices,
      TCommands,
      TUsed & { Args: true }
    >,
    TUsed & { Args: true }
  > {
    this.argsSchema = schema as unknown as ZodType<TArgs>;
    return this as any;
  }

  public Flags<NextFlags extends Record<string, unknown>>(
    schema: ZodType<NextFlags>,
  ): RemoveUsed<
    CommandModuleBuilder<
      TArgs,
      NextFlags,
      CommandParams<TArgs, NextFlags>,
      TServices,
      TCommands,
      TUsed & { Flags: true }
    >,
    TUsed & { Flags: true }
  > {
    this.flagsSchema = schema as unknown as ZodType<TFlags>;
    return this as any;
  }

  public Params<NextParams extends CommandParams<TArgs, TFlags>>(
    ctor: CommandParamConstructor<TArgs, TFlags, NextParams>,
  ): RemoveUsed<
    CommandModuleBuilder<
      TArgs,
      TFlags,
      NextParams,
      TServices,
      TCommands,
      TUsed & { Params: true }
    >,
    TUsed & { Params: true }
  > {
    this.paramsCtor = ctor as unknown as CommandParamConstructor<
      TArgs,
      TFlags,
      TParams
    >;
    return this as any;
  }

  public Services<NextServices extends Record<string, unknown>>(
    factory: (
      ctx: CommandContext<TParams, TServices, TCommands>,
      ioc: IoCContainer,
    ) => Promise<NextServices>,
  ): RemoveUsed<
    CommandModuleBuilder<
      TArgs,
      TFlags,
      TParams,
      NextServices,
      TCommands,
      TUsed & { Services: true }
    >,
    TUsed & { Services: true }
  > {
    this.servicesFactory = factory as any;
    return this as any;
  }

  public Init(
    fn: (
      ctx: CommandContext<TParams, TServices, TCommands>,
    ) => void | Promise<void>,
  ): RemoveUsed<
    CommandModuleBuilder<
      TArgs,
      TFlags,
      TParams,
      TServices,
      TCommands,
      TUsed & { Init: true }
    >,
    TUsed & { Init: true }
  > {
    this.initFn = fn;
    return this as any;
  }

  public Cleanup(
    fn: (
      ctx: CommandContext<TParams, TServices, TCommands>,
    ) => void | Promise<void>,
  ): RemoveUsed<
    CommandModuleBuilder<
      TArgs,
      TFlags,
      TParams,
      TServices,
      TCommands,
      TUsed & { Cleanup: true }
    >,
    TUsed & { Cleanup: true }
  > {
    this.cleanupFn = fn;
    return this as any;
  }

  public DryRun(
    fn: (
      ctx: CommandContext<TParams, TServices, TCommands>,
    ) => void | number | Promise<void | number>,
  ): RemoveUsed<
    CommandModuleBuilder<
      TArgs,
      TFlags,
      TParams,
      TServices,
      TCommands,
      TUsed & { DryRun: true }
    >,
    TUsed & { DryRun: true }
  > {
    this.dryRunFn = fn;
    return this as any;
  }

  public Run(
    fn: (
      ctx: CommandContext<TParams, TServices, TCommands>,
    ) => void | number | Promise<void | number>,
  ): RemoveUsed<
    CommandModuleBuilder<
      TArgs,
      TFlags,
      TParams,
      TServices,
      TCommands,
      TUsed & { Run: true }
    >,
    TUsed & { Run: true }
  > {
    this.runFn = fn;
    return this as any;
  }

  public Commands<
    TSubcommands extends Record<string, CommandModule<any, any, any>>,
  >(
    commands: TSubcommands,
  ): RemoveUsed<
    CommandModuleBuilder<
      TArgs,
      TFlags,
      TParams,
      TServices,
      ExtractInvokerMap<TSubcommands>,
      TUsed & { Commands: true }
    >,
    TUsed & { Commands: true }
  > {
    this.subcommands = commands;
    return this as any;
  }

  public Build(): CommandModule<TArgs, TFlags, TParams> {
    const {
      name,
      description,
      argsSchema,
      flagsSchema,
      runFn,
      initFn,
      cleanupFn,
      dryRunFn,
      servicesFactory,
      subcommands,
      paramsCtor,
    } = this;

    if (!argsSchema || !flagsSchema || !runFn || !paramsCtor) {
      throw new Error(
        "CommandModuleBuilder is missing required Args, Flags, Params, or Run configuration.",
      );
    }

    class BuiltCommand extends CommandRuntime<TParams, TServices, TCommands> {
      override async Init(
        ctx: CommandContext<TParams, TServices, TCommands>,
        _ioc: IoCContainer,
      ) {
        if (initFn) await initFn(ctx);
      }

      override async Run(
        ctx: CommandContext<TParams, TServices, TCommands>,
        _ioc: IoCContainer,
      ) {
        return await runFn!(ctx);
      }

      override async Cleanup(
        ctx: CommandContext<TParams, TServices, TCommands>,
        _ioc: IoCContainer,
      ) {
        if (cleanupFn) await cleanupFn(ctx);
      }

      override async DryRun(
        ctx: CommandContext<TParams, TServices, TCommands>,
        ioc: IoCContainer,
      ) {
        if (dryRunFn) {
          return await dryRunFn(ctx);
        } else {
          return await this.Run(ctx, ioc);
        }
      }

      protected override async injectServices(
        ctx: CommandContext<TParams, TServices, TCommands>,
        ioc: IoCContainer,
      ): Promise<Partial<TServices>> {
        return servicesFactory ? await servicesFactory(ctx, ioc) : {};
      }

      protected override injectCommands(
        ctx: CommandContext<TParams, TServices, TCommands>,
        ioc: IoCContainer,
      ): Promise<TCommands> {
        if (!subcommands) return Promise.resolve({} as TCommands);

        const invokers: CommandInvokerMap = {};

        for (const [key, mod] of Object.entries(subcommands)) {
          const runtime = new mod.Command();
          const ctor = mod.Params;

          invokers[key] = async (
            args?: string[],
            flags?: Record<string, unknown>,
          ) => {
            const executor = new CLICommandExecutor(
              ioc,
              await ioc.Resolve(CLICommandResolver),
            );

            await executor.Execute(ctx.Config, runtime, {
              key,
              flags: flags ?? {},
              positional: args ?? [],
              paramsCtor: ctor,
              baseTemplatesDir: undefined,
            });
          };
        }

        return Promise.resolve(invokers as TCommands);
      }

      override BuildMetadata() {
        return this.buildMetadataFromSchemas(
          name,
          description,
          argsSchema,
          flagsSchema,
        );
      }
    }

    return {
      ArgsSchema: argsSchema,
      FlagsSchema: flagsSchema,
      Command: BuiltCommand,
      Params: paramsCtor,
    };
  }
}
