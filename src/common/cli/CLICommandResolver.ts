import type { ZodSchema } from "./.deps.ts";
import type { CLICommandEntry } from "./CLICommandEntry.ts";
import type { CommandParamConstructor } from "./commands/CommandParams.ts";
import type { CommandRuntime } from "./commands/CommandRuntime.ts";

/**
 * Interface for resolving CLI commands from source files.
 */
export interface CLICommandResolver {
  /**
   * Scans a command directory and returns all available CLI command entries.
   */
  ResolveCommandMap(baseDir: string): Promise<Map<string, CLICommandEntry>>;

  /**
   * Loads and instantiates a CLI command with its runtime schemas and parameters.
   *
   * @param path Path to the command module.
   * @param flags Parsed CLI flags.
   * @param args Positional arguments.
   */
  LoadCommandInstance(path: string): Promise<{
    ArgsSchema?: ZodSchema;
    Command: CommandRuntime;
    FlagsSchema?: ZodSchema;
    Params?: CommandParamConstructor;
  }>;
}
