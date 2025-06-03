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

/**
 * Strongly typed context passed to every command method (Init, Run, DryRun, Cleanup).
 */
export type CommandContext<
  P extends CommandParams<any, any> = CommandParams<any, any>,
  S extends Record<string, unknown> = Record<string, unknown>,
> = {
  /** Zod schema for positional arguments */
  ArgsSchema?: ZodSchema;

  /** The parsed CLI configuration object (.cli.json) */
  Config: CLIConfig;

  /** Zod schema for named flags */
  FlagsSchema?: ZodSchema;

  /** Metadata for the resolved parent command group, if applicable */
  GroupMetadata?: CommandModuleMetadata;

  /** The resolved key for the executed command (e.g. 'init', 'run/hello') */
  Key: string;

  /** Centralized logging API, supports injection, theming, formatting */
  Log: {
    Info: (...args: unknown[]) => void;
    Warn: (...args: unknown[]) => void;
    Error: (...args: unknown[]) => void;
    Success: (...args: unknown[]) => void;
  };

  /** Fully populated metadata for the resolved command (if any) */
  Metadata?: CommandModuleMetadata;

  /** Runtime parameters object derived from schema + command logic */
  Params: P;

  /** Fully resolved runtime service instances, from `.Services(...)` */
  Services: S;
};

/**
 * Zod runtime validator for CommandContext — excludes generic fields
 * like `Params`, `ArgsSchema`, `FlagsSchema` that are typed dynamically.
 */
export const CommandContextSchema: z.ZodType<
  Omit<CommandContext, "Params" | "ArgsSchema" | "FlagsSchema">
> = z.object({
  Config: CLIConfigSchema.describe("The parsed CLI config file (.cli.json)"),

  GroupMetadata: CommandModuleMetadataSchema.optional().describe(
    "Metadata for the resolved parent command group, if applicable",
  ),

  Key: z.string().describe(
    'The resolved key for the current command (e.g. "init" or "run/hello")',
  ),

  Log: z
    .object({
      Info: z.function().args(z.any()).returns(z.void()).describe(
        "Standard output logging",
      ),
      Warn: z.function().args(z.any()).returns(z.void()).describe(
        "Warning output logging",
      ),
      Error: z.function().args(z.any()).returns(z.void()).describe(
        "Error output logging",
      ),
      Success: z.function().args(z.any()).returns(z.void()).describe(
        "Success message logging",
      ),
    })
    .describe("Logging interface for command output"),

  Metadata: CommandModuleMetadataSchema.optional().describe(
    "Metadata for the resolved command module",
  ),

  Services: z
    .record(z.unknown())
    .describe("Resolved service instances from .Services(...)"),
});

/**
 * Runtime shape derived from schema — does not include Params or Schemas.
 */
export type CommandContextSchema = z.infer<typeof CommandContextSchema>;
