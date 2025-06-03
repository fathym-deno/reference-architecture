// deno-lint-ignore-file no-explicit-any
import type { IoCContainer, ZodSchema } from "../.deps.ts";
import type { CommandContext } from "./CommandContext.ts";
import type { CommandModuleMetadata } from "./CommandModuleMetadata.ts";
import type { CommandParams } from "./CommandParams.ts";
import type { CommandSuggestions } from "./CommandSuggestions.ts";

/**
 * Base class for all CLI commands.
 * Generic over Params and Services for full downstream inference.
 */
export abstract class CommandRuntime<
  P extends CommandParams<any, any> = CommandParams<any, any>,
  S extends Record<string, unknown> = Record<string, unknown>,
> {
  /**
   * Must return CLI metadata used in help output, docs, and introspection.
   */
  public abstract BuildMetadata(): CommandModuleMetadata;

  /**
   * Optional setup hook before command execution.
   */
  public Init?(
    ctx: CommandContext<P, S>,
    ioc: IoCContainer,
  ): void | Promise<void>;

  /**
   * Main execution logic.
   * Must be implemented by all commands.
   */
  public abstract Run(
    ctx: CommandContext<P, S>,
    ioc: IoCContainer,
  ): void | number | Promise<void | number>;

  /**
   * Optional preview-mode logic (if --dry-run is passed).
   */
  public DryRun?(
    ctx: CommandContext<P, S>,
    ioc: IoCContainer,
  ): void | number | Promise<void | number>;

  /**
   * Optional teardown hook after execution (regardless of success/failure).
   */
  public Cleanup?(
    ctx: CommandContext<P, S>,
    ioc: IoCContainer,
  ): void | Promise<void>;

  /**
   * Optionally provide suggestions for flags and arguments.
   */
  public Suggestions?(
    ctx: CommandContext<P, S>,
    _ioc: IoCContainer,
  ): CommandSuggestions {
    return this.buildSuggestionsFromSchemas(ctx.FlagsSchema, ctx.ArgsSchema);
  }

  /**
   * Autogenerate argument/flag suggestions from Zod schemas.
   */
  protected buildSuggestionsFromSchemas(
    flagsSchema?: ZodSchema,
    argsSchema?: ZodSchema,
  ): CommandSuggestions {
    const flags: string[] = [];
    const args: string[] = [];

    if (
      flagsSchema &&
      typeof flagsSchema === "object" &&
      "shape" in flagsSchema
    ) {
      flags.push(...Object.keys((flagsSchema as any).shape));
    }

    if ((argsSchema as any)?._def?.items) {
      args.push(
        ...(argsSchema as any)._def.items.map(
          (_: unknown, i: number) => `<arg${i + 1}>`,
        ),
      );
    }

    return { Flags: flags, Args: args };
  }

  /**
   * Build usage + examples based on schema structure.
   */
  protected buildMetadataFromSchemas(
    name: string,
    description?: string,
    argsSchema?: ZodSchema,
    flagsSchema?: ZodSchema,
  ): CommandModuleMetadata {
    const usageParts: string[] = [];

    if ((argsSchema as any)?._def?.items?.length) {
      usageParts.push(
        ...(argsSchema as any)._def.items.map(
          (_: unknown, i: number) => `<arg${i + 1}>`,
        ),
      );
    }

    if (
      flagsSchema &&
      typeof flagsSchema === "object" &&
      "shape" in flagsSchema
    ) {
      usageParts.push(
        ...Object.keys((flagsSchema as any).shape).map((f) => `[--${f}]`),
      );
    }

    const usage = usageParts.join(" ");
    const examples = usage ? [usage] : [];

    return {
      Name: name,
      Description: description,
      Usage: usage,
      Examples: examples,
    };
  }
}
