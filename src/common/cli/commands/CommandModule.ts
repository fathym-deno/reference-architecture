// deno-lint-ignore-file no-explicit-any
import type { ZodSchema } from '../.deps.ts';
import type { CommandParams, Command, CommandSuggestions } from '../CLI.ts';
import type { CommandModuleMetadata } from '../commands/CommandModuleMetadata.ts';

/**
 * Represents a complete, executable CLI command module.
 * Includes runtime class, schemas for validation and docs, and metadata for help.
 */
export type CommandModule = {
  /**
   * Zod schema defining the expected positional arguments.
   * Used for validation, introspection, and help generation.
   */
  ArgsSchema: ZodSchema;

  /**
   * The executable command class. Must implement the `Run()` method from the `Command` interface.
   */
  Command: new (params: CommandParams<any, any>) => Command;

  /**
   * Zod schema defining the named flags for the command.
   * Used for parsing, validation, and documentation.
   */
  FlagsSchema: ZodSchema;

  /**
   * Metadata about the command — name, description, usage, examples.
   * Used in CLI help, docs, and command listings.
   */
  Metadata: CommandModuleMetadata;

  /**
   * Optional parameter class that provides typed access to flags and args.
   * Used to construct the `params` passed into the command at runtime.
   */
  Params?: new (
    flags: Record<string, unknown>,
    args: unknown[]
  ) => CommandParams<any, any>;

  /**
   * Optional static suggestions to power autocomplete for flags and args.
   * If omitted, suggestions may be derived from the provided schemas.
   */
  Suggestions: CommandSuggestions;
};
