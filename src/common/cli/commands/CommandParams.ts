// deno-lint-ignore-file no-explicit-any ban-types

/**
 * Base class for all CLI command parameter sets.
 * Provides typed access to raw flags and args, plus standard dry-run support.
 */
export abstract class CommandParams<
  F extends Record<string, unknown> = {},
  A extends unknown[] = [],
> {
  constructor(public readonly Flags: F, public readonly Args: A) {}

  /**
   * Indicates whether this command was invoked in dry-run mode.
   * Automatically derived from the `--dry-run` flag.
   */
  public get DryRun(): boolean {
    return !!this.Flag("dry-run");
  }

  /**
   * Get a positional argument by index.
   */
  protected Arg<Index extends keyof A & number>(
    index: Index,
  ): A[Index] | undefined {
    return this.Args?.[index];
  }

  /**
   * Get a named flag by key.
   */
  protected Flag<K extends keyof F>(key: K): F[K] | undefined {
    return this.Flags?.[key];
  }
}

export type CommandParamConstructor = new (
  flags: Record<string, unknown>,
  args: unknown[],
) => CommandParams<any, any>;
