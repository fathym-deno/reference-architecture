// deno-lint-ignore-file no-explicit-any
import type { ZodSchema } from "../.deps.ts";
import type { CommandModuleMetadata } from "./CommandModuleMetadata.ts";
import type { CommandParams } from "./CommandParams.ts";
import type { CommandSuggestions } from "./CommandSuggestions.ts";

/**
 * Base class for all CLI commands.
 * Provides lifecycle hooks, metadata, autocomplete support, and schema-derived suggestions.
 */
export abstract class Command<
  P extends CommandParams<any, any> = CommandParams<any, any>,
> {
  constructor(
    public Params: P,
    protected readonly argsSchema?: ZodSchema,
    protected readonly flagsSchema?: ZodSchema,
  ) {}

  /**
   * Main execution logic.
   * Must be implemented by all commands.
   */
  public abstract Run(): void | number | Promise<void | number>;

  /**
   * Optional setup hook before command execution.
   */
  public Init?(): void | Promise<void>;

  /**
   * Optional preview-mode logic.
   * If `--dry-run` is passed, this is called instead of `Run()`.
   */
  public DryRun?(): void | number | Promise<void | number>;

  /**
   * Optional teardown hook after execution (regardless of success/failure).
   */
  public Cleanup?(): void | Promise<void>;

  /**
   * Must return CLI metadata used in help output, docs, and introspection.
   */
  public abstract BuildMetadata(): CommandModuleMetadata;

  /**
   * Returns CLI suggestions derived from schemas unless explicitly overridden.
   */
  public BuildSuggestions(): CommandSuggestions {
    return this.buildSuggestionsFromSchemas(this.flagsSchema, this.argsSchema);
  }

  /**
   * Generates autocomplete suggestions from Zod schemas.
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
   * Builds command metadata with inferred usage and example string(s)
   * based on argument and flag schemas.
   *
   * @param name - Friendly name used in help UIs (e.g. "Dev Mode")
   * @param description - Optional description for CLI help
   */
  protected buildMetadataFromSchemas(
    name: string,
    description?: string,
  ): CommandModuleMetadata {
    const usageParts: string[] = [];

    // Add positional args from tuple
    if ((this.argsSchema as any)?._def?.items?.length) {
      usageParts.push(
        ...(this.argsSchema as any)._def.items.map(
          (_: unknown, i: number) => `<arg${i + 1}>`,
        ),
      );
    }

    // Add flags from object shape
    if (
      this.flagsSchema &&
      typeof this.flagsSchema === "object" &&
      "shape" in this.flagsSchema
    ) {
      const flagKeys = Object.keys((this.flagsSchema as any).shape);
      if (flagKeys.length) {
        usageParts.push(...flagKeys.map((f) => `[--${f}]`));
      }
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
