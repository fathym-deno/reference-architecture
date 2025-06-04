// deno-lint-ignore-file no-explicit-any
import type { ZodType, ZodSchema } from '../.deps.ts';
import type { IoCContainer } from '../.deps.ts';

import type { CommandModule } from '../commands/CommandModule.ts';
import type { CommandContext } from '../commands/CommandContext.ts';
import type {
  CommandParamConstructor,
  CommandParams,
} from '../commands/CommandParams.ts';

import { CommandRuntime } from '../commands/CommandRuntime.ts';
import { CLICommandExecutor } from '../CLICommandExecutor.ts';
import type { CommandInvokerMap } from '../commands/CommandContext.ts';

/**
 * Derives a typed map of subcommand invokers from a set of CommandModules.
 */
export type ExtractInvokerMap<T extends Record<string, CommandModule>> = {
  [K in keyof T]: T[K] extends CommandModule<infer A, infer F>
    ? (args?: A, flags?: F) => Promise<void | number>
    : (
        args?: readonly unknown[],
        flags?: Record<string, unknown>
      ) => Promise<void | number>;
};

export class CommandModuleBuilder<
  TArgs extends readonly unknown[] = readonly unknown[],
  TFlags extends Record<string, unknown> = Record<string, unknown>,
  TParams extends CommandParams<TArgs, TFlags> = CommandParams<TArgs, TFlags>,
  TServices extends Record<string, unknown> = Record<string, unknown>,
  TCommands extends CommandInvokerMap = CommandInvokerMap
> {
  protected argsSchema?: ZodType<TArgs>;
  protected flagsSchema?: ZodType<TFlags>;
  protected runFn?: (
    ctx: CommandContext<TParams, TServices, TCommands>
  ) => void | number | Promise<void | number>;
  protected initFn?: (
    ctx: CommandContext<TParams, TServices, TCommands>
  ) => void | Promise<void>;
  protected cleanupFn?: (
    ctx: CommandContext<TParams, TServices, TCommands>
  ) => void | Promise<void>;
  protected dryRunFn?: (
    ctx: CommandContext<TParams, TServices, TCommands>
  ) => void | number | Promise<void | number>;
  protected servicesFactory?: (
    ctx: CommandContext<TParams, TServices, TCommands>,
    ioc: IoCContainer
  ) => Promise<TServices>;
  protected subcommands?: Record<
    string,
    CommandModule<readonly unknown[], Record<string, unknown>>
  >;

  protected paramsCtor?: CommandParamConstructor<TArgs, TFlags, TParams>;

  constructor(
    protected readonly name: string,
    protected readonly description: string
  ) {}

  public Args(schema: ZodType<TArgs>): this {
    this.argsSchema = schema;
    return this;
  }

  public Flags(schema: ZodType<TFlags>): this {
    this.flagsSchema = schema;
    return this;
  }

  public Params<
    NextArgs extends readonly unknown[],
    NextFlags extends Record<string, unknown>,
    NextParams extends CommandParams<NextArgs, NextFlags>
  >(
    ctor: CommandParamConstructor<NextArgs, NextFlags, NextParams>
  ): CommandModuleBuilder<
    NextArgs,
    NextFlags,
    NextParams,
    TServices,
    TCommands
  > {
    this.paramsCtor = ctor as any;
    return this as any;
  }

  public Services<NextServices extends Record<string, unknown>>(
    factory: (
      ctx: CommandContext<TParams, TServices, TCommands>,
      ioc: IoCContainer
    ) => Promise<NextServices>
  ): CommandModuleBuilder<TArgs, TFlags, TParams, NextServices, TCommands> {
    this.servicesFactory = factory as any;
    return this as any;
  }

  public Init(
    fn: (
      ctx: CommandContext<TParams, TServices, TCommands>
    ) => void | Promise<void>
  ): this {
    this.initFn = fn;
    return this;
  }

  public Cleanup(
    fn: (
      ctx: CommandContext<TParams, TServices, TCommands>
    ) => void | Promise<void>
  ): this {
    this.cleanupFn = fn;
    return this;
  }

  public DryRun(
    fn: (
      ctx: CommandContext<TParams, TServices, TCommands>
    ) => void | number | Promise<void | number>
  ): this {
    this.dryRunFn = fn;
    return this;
  }

  public Run(
    fn: (
      ctx: CommandContext<TParams, TServices, TCommands>
    ) => void | number | Promise<void | number>
  ): this {
    this.runFn = fn;
    return this;
  }

  public Commands<
    TSubcommands extends Record<
      string,
      CommandModule<readonly unknown[] | unknown[], Record<string, unknown>>
    >
  >(
    commands: TSubcommands
  ): CommandModuleBuilder<
    TArgs,
    TFlags,
    TParams,
    TServices,
    ExtractInvokerMap<TSubcommands>
  > {
    this.subcommands = commands;
    return this as any;
  }

  public Build(): CommandModule<TArgs, TFlags> {
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
        'CommandModuleBuilder is missing required Args, Flags, Params, or Run configuration.'
      );
    }

    class BuiltCommand extends CommandRuntime<TParams, TServices, TCommands> {
      override async Init(
        ctx: CommandContext<TParams, TServices, TCommands>,
        _ioc: IoCContainer
      ) {
        if (initFn) await initFn(ctx);
      }

      override async Run(
        ctx: CommandContext<TParams, TServices, TCommands>,
        _ioc: IoCContainer
      ) {
        return await runFn!(ctx);
      }

      override async Cleanup(
        ctx: CommandContext<TParams, TServices, TCommands>,
        _ioc: IoCContainer
      ) {
        if (cleanupFn) await cleanupFn(ctx);
      }

      override async DryRun(
        ctx: CommandContext<TParams, TServices, TCommands>,
        _ioc: IoCContainer
      ) {
        if (dryRunFn) return await dryRunFn(ctx);
      }

      protected override async injectServices(
        ctx: CommandContext<TParams, TServices, TCommands>,
        ioc: IoCContainer
      ): Promise<Partial<TServices>> {
        return servicesFactory ? await servicesFactory(ctx, ioc) : {};
      }

      protected override async injectCommands(
        ctx: CommandContext<TParams, TServices, TCommands>,
        ioc: IoCContainer
      ): Promise<TCommands> {
        if (!subcommands) return {} as TCommands;

        const invokers: CommandInvokerMap = {};

        for (const [key, mod] of Object.entries(subcommands)) {
          const runtime = new mod.Command();
          const ctor = mod.Params;

          invokers[key] = async (
            args?: string[],
            flags?: Record<string, unknown>
          ) => {
            const executor = new CLICommandExecutor(ioc);
            await executor.Execute(ctx.Config, runtime, {
              key,
              flags: flags ?? {},
              positional: args ?? [],
              paramsCtor: ctor,
              templates: undefined,
            });
          };
        }

        return invokers as TCommands;
      }

      override BuildMetadata() {
        return this.buildMetadataFromSchemas(
          name,
          description,
          argsSchema,
          flagsSchema
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
