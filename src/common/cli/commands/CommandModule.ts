// deno-lint-ignore-file no-explicit-any
import type { ZodType, ZodTypeDef } from '../.deps.ts';
import type { CommandRuntime } from './CommandRuntime.ts';
import type {
  CommandParamConstructor,
  CommandParams,
} from './CommandParams.ts';

/**
 * Represents a complete, executable CLI command module.
 * Includes runtime class, schemas for validation and docs, and metadata for help.
 */
export type CommandModule<
  A extends readonly unknown[] = readonly unknown[],
  F extends Record<string, unknown> = Record<string, unknown>
> = {
  /**
   * Zod schema defining the expected positional arguments.
   */
  ArgsSchema: ZodType<A>;

  /**
   * The executable command class.
   */
  Command: new () => CommandRuntime<any>;

  /**
   * Zod schema defining the named flags for the command.
   */
  FlagsSchema: ZodType<F>;

  /**
   * Optional parameter class that provides typed access to flags and args.
   */
  Params?: CommandParamConstructor<A, F, any>;
};

/**
 * Strongly typed helper to define a CLI CommandModule cleanly.
 * Ensures full type inference for flags, args, and param classes.
 */
export function defineCommandModule<
  F extends Record<string, unknown>,
  A extends unknown[],
  CP extends CommandParams<A, F>,
  CC extends new (params: CP) => CommandRuntime<CP>
>(def: {
  FlagsSchema: ZodType<F, ZodTypeDef, F>;
  ArgsSchema: ZodType<A, ZodTypeDef, A>;
  Command: CC;
  Params: new (args: A, flags: F) => CP;
}): CommandModule<A, F> {
  return {
    FlagsSchema: def.FlagsSchema,
    ArgsSchema: def.ArgsSchema,
    Command: def.Command as unknown as new () => CommandRuntime<any>,
    Params: def.Params as CommandParamConstructor<A, F, any>,
  };
}
