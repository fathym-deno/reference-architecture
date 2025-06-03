import type { ZodSchema } from "../.deps.ts";
import type { IoCContainer } from "../.deps.ts";
import type { CommandModule } from "../commands/CommandModule.ts";
import type { CommandContext } from "../commands/CommandContext.ts";
import type {
  CommandParamConstructor,
  CommandParams,
} from "../commands/CommandParams.ts";
import { CommandRuntime } from "../commands/CommandRuntime.ts";

export class CommandModuleBuilder<
  F extends Record<string, unknown> = Record<string, unknown>,
  A extends unknown[] = unknown[],
  P extends CommandParams<F, A> = CommandParams<F, A>,
  S extends Record<string, unknown> = Record<string, unknown>,
> {
  protected argsSchema?: ZodSchema;
  protected flagsSchema?: ZodSchema;
  protected runFn?: (
    ctx: CommandContext<P, S>,
  ) => void | number | Promise<void | number>;
  protected initFn?: (ctx: CommandContext<P, S>) => void | Promise<void>;
  protected cleanupFn?: (ctx: CommandContext<P, S>) => void | Promise<void>;
  protected dryRunFn?: (
    ctx: CommandContext<P, S>,
  ) => void | number | Promise<void | number>;
  protected servicesFactory?: (
    ctx: CommandContext<P, S>,
    ioc: IoCContainer,
  ) => Promise<S>;
  protected paramsCtor?: CommandParamConstructor<F, A, P>;

  constructor(
    protected readonly name: string,
    protected readonly description: string,
  ) {}

  public Args(schema: ZodSchema): this {
    this.argsSchema = schema;
    return this;
  }

  public Flags(schema: ZodSchema): this {
    this.flagsSchema = schema;
    return this;
  }

  public Params<
    NF extends Record<string, unknown>,
    NA extends unknown[],
    NP extends CommandParams<NF, NA>,
  >(
    ctor: CommandParamConstructor<NF, NA, NP>,
  ): CommandModuleBuilder<NF, NA, NP, S> {
    this.paramsCtor = ctor as unknown as CommandParamConstructor<F, A, P>;
    return this as unknown as CommandModuleBuilder<NF, NA, NP, S>;
  }

  public Services<NextS extends Record<string, unknown>>(
    factory: (ctx: CommandContext<P, S>, ioc: IoCContainer) => Promise<NextS>,
  ): CommandModuleBuilder<F, A, P, NextS> {
    this.servicesFactory = factory as unknown as typeof this.servicesFactory;
    return this as unknown as CommandModuleBuilder<F, A, P, NextS>;
  }

  public Init(fn: (ctx: CommandContext<P, S>) => void | Promise<void>): this {
    this.initFn = fn;
    return this;
  }

  public Cleanup(
    fn: (ctx: CommandContext<P, S>) => void | Promise<void>,
  ): this {
    this.cleanupFn = fn;
    return this;
  }

  public DryRun(
    fn: (ctx: CommandContext<P, S>) => void | number | Promise<void | number>,
  ): this {
    this.dryRunFn = fn;
    return this;
  }

  public Run(
    fn: (ctx: CommandContext<P, S>) => void | number | Promise<void | number>,
  ): this {
    this.runFn = fn;
    return this;
  }

  public Build(): CommandModule {
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
      paramsCtor,
    } = this;

    if (!argsSchema || !flagsSchema || !runFn || !paramsCtor) {
      throw new Error(
        "CommandModuleBuilder is missing required Args, Flags, Params, or Run configuration.",
      );
    }

    class BuiltCommand extends CommandRuntime<P, S> {
      private async withServices(
        ctx: CommandContext<P, S>,
        ioc: IoCContainer,
      ): Promise<CommandContext<P, S>> {
        if (servicesFactory) {
          const extra = await servicesFactory(ctx, ioc);
          ctx.Services = { ...(ctx.Services ?? {}), ...extra };
        }
        return ctx;
      }

      override async Init(
        ctx: CommandContext<P, S>,
        ioc: IoCContainer,
      ): Promise<void> {
        const hydrated = await this.withServices(ctx, ioc);
        if (initFn) await initFn(hydrated);
      }

      override async Run(
        ctx: CommandContext<P, S>,
        ioc: IoCContainer,
      ): Promise<void | number> {
        const hydrated = await this.withServices(ctx, ioc);
        return await runFn!(hydrated);
      }

      override async Cleanup(
        ctx: CommandContext<P, S>,
        ioc: IoCContainer,
      ): Promise<void> {
        const hydrated = await this.withServices(ctx, ioc);
        if (cleanupFn) await cleanupFn(hydrated);
      }

      override async DryRun(
        ctx: CommandContext<P, S>,
        ioc: IoCContainer,
      ): Promise<void | number> {
        const hydrated = await this.withServices(ctx, ioc);
        if (dryRunFn) return await dryRunFn(hydrated);
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
