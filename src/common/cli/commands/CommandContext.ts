// deno-lint-ignore-file no-explicit-any
import { z } from "../.deps.ts";
import type { ZodSchema } from "../.deps.ts";

import type { CLIConfig } from "../CLIConfig.ts";
import { CLIConfigSchema } from "../CLIConfig.ts";

import type { CommandParams } from "./CommandParams.ts";
import {
  type CommandModuleMetadata,
  CommandModuleMetadataSchema,
} from "./CommandModuleMetadata.ts";

import { type CommandLog, CommandLogSchema } from "./CommandLog.ts";

/**
 * A map of command invocation functions.
 * Each key represents a subcommand, and each value is a function that executes that subcommand
 * with named flags and optional positional args.
 */
export type CommandInvokerMap = Record<
  string,
  (
    args?: string[],
    flags?: Record<string, unknown>,
  ) => Promise<void | number>
>;

/**
 * CommandContext defines the full execution context passed to each command lifecycle method
 * (`Init`, `Run`, `DryRun`, and `Cleanup`). It includes schemas, CLI config, command metadata,
 * resolved runtime parameters, logging tools, service instances, and optional subcommands.
 *
 * @template P Type of parsed parameter class (extends CommandParams)
 * @template S Type of injected services (via `.Services()` or `ProvideServices`)
 * @template C Map of subcommands (injected via `.Commands(...)`)
 */
export type CommandContext<
  P extends CommandParams<any, any> = CommandParams<any, any>,
  S extends Record<string, unknown> = Record<string, unknown>,
  C extends CommandInvokerMap = CommandInvokerMap,
> = {
  ArgsSchema?: ZodSchema;
  FlagsSchema?: ZodSchema;
  Config: CLIConfig;
  GroupMetadata?: CommandModuleMetadata;
  Key: string;
  Metadata?: CommandModuleMetadata;
  Log: CommandLog;
  Params: P;
  Services: S;
  Commands?: C;
};

/**
 * Zod schema representation of the runtime-safe subset of CommandContext.
 * Excludes generics like `Params`, `ArgsSchema`, `FlagsSchema`, and `Commands`.
 * Used for help output, runtime metadata, and context debugging.
 */
export const CommandContextSchema: z.ZodType<
  Omit<CommandContext, "Params" | "ArgsSchema" | "FlagsSchema" | "Commands">
> = z.object({
  Config: CLIConfigSchema.describe("Parsed CLI configuration (.cli.json)"),

  GroupMetadata: CommandModuleMetadataSchema.optional().describe(
    "Metadata for the resolved parent command group, if applicable",
  ),

  Key: z
    .string()
    .describe('Normalized command key (e.g. "init", "schema/promote", etc.)'),

  Log: CommandLogSchema.describe(
    "Logging interface used for structured output",
  ),

  Metadata: CommandModuleMetadataSchema.optional().describe(
    "Metadata for the active command module",
  ),

  Services: z
    .record(z.unknown())
    .describe("Resolved runtime services injected into the command context"),
});

/**
 * Runtime-typed version of CommandContext for validation, help, and introspection.
 */
export type CommandContextSchema = z.infer<typeof CommandContextSchema>;
