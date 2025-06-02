import { z } from "../.deps.ts";
import { type CLIConfig, CLIConfigSchema } from "../CLIConfig.ts";
import {
  type CommandModuleMetadata,
  CommandModuleMetadataSchema,
} from "./CommandModuleMetadata.ts";

/**
 * Represents the contextual data and runtime environment passed to
 * a CLI command's `Run` or `DryRun` method.
 */
export type CommandContext = {
  /** The parsed CLI configuration object (.cli.json) */
  Config: CLIConfig;

  /** The resolved key for the executed command (e.g. 'init', 'run/hello') */
  Key: string;

  /** Fully populated metadata for the resolved command (if any) */
  Metadata?: CommandModuleMetadata;

  /** Metadata for the resolved group (if part of a group chain) */
  GroupMetadata?: CommandModuleMetadata;

  /** Centralized logging API, supports injection, theming, formatting */
  Log: {
    Info: (...args: unknown[]) => void;
    Warn: (...args: unknown[]) => void;
    Error: (...args: unknown[]) => void;
    Success: (...args: unknown[]) => void;
  };
};

/**
 * Zod schema for validating a CommandContext object.
 * Used for runtime validation, type safety, and command assertions.
 */
export const CommandContextSchema: z.ZodType<CommandContext> = z.object({
  Config: CLIConfigSchema.describe("The parsed CLI config file (.cli.json)"),

  Key: z
    .string()
    .describe(
      'The resolved key for the current command (e.g. "init" or "run/hello")',
    ),

  Metadata: CommandModuleMetadataSchema.optional().describe(
    "Metadata for the resolved command module",
  ),

  GroupMetadata: CommandModuleMetadataSchema.optional().describe(
    "Metadata for the resolved parent command group, if applicable",
  ),

  Log: z
    .object({
      Info: z
        .function()
        .args(z.any())
        .returns(z.void())
        .describe("Standard output logging"),
      Warn: z
        .function()
        .args(z.any())
        .returns(z.void())
        .describe("Warning output logging"),
      Error: z
        .function()
        .args(z.any())
        .returns(z.void())
        .describe("Error output logging"),
      Success: z
        .function()
        .args(z.any())
        .returns(z.void())
        .describe("Success message logging"),
    })
    .describe("Logging interface for command output"),
});

/**
 * Inferred runtime type from the CommandContextSchema
 */
export type CommandContextSchema = z.infer<typeof CommandContextSchema>;
