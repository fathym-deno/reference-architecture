// deno-lint-ignore-file no-explicit-any
import type { ZodSchema, ZodType, ZodTypeDef } from "../.deps.ts";
import type { CommandRuntime } from "./CommandRuntime.ts";
import type {
  CommandParamConstructor,
  CommandParams,
} from "./CommandParams.ts";

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
  Command: new () => CommandRuntime;

  /**
   * Zod schema defining the named flags for the command.
   * Used for parsing, validation, and documentation.
   */
  FlagsSchema: ZodSchema;

  /**
   * Optional parameter class that provides typed access to flags and args.
   * Used to construct the `params` passed into the command at runtime.
   */
  Params?: CommandParamConstructor<any, any, any>;
};

/**
 * Typed helper to define a CLI CommandModule cleanly.
 * Ensures type safety while hiding generic coercion.
 */
export function defineCommandModule<
  F extends Record<string, unknown>,
  A extends unknown[],
  CP extends CommandParams<F, A>,
  CC extends new (params: CP) => CommandRuntime<CP>,
  FS extends ZodType<F, ZodTypeDef, F>,
  AS extends ZodType<A, ZodTypeDef, A>,
>(def: {
  FlagsSchema: FS;
  ArgsSchema: AS;
  Command: CC;
  Params: new (flags: F, args: A) => CP;
}): CommandModule {
  return {
    FlagsSchema: def.FlagsSchema,
    ArgsSchema: def.ArgsSchema,
    Command: def.Command as unknown as new () => CommandRuntime<any>,
    Params: def.Params as unknown as CommandParamConstructor,
  };
}
