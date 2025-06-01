import { z } from "../.deps.ts";

/**
 * Represents the metadata for a single CLI command module.
 * This metadata includes the command's name, description, usage, and examples.
 */
export type CommandModuleMetadata = {
  Name: string;
  Description?: string;
  Usage?: string;
  Examples?: string[];
};

/**
 * Zod schema to validate the structure of the CommandModuleMetadata.
 * This schema ensures that the Name is required, and other properties are optional.
 */
export const CommandModuleMetadataSchema: z.ZodObject<
  {
    Name: z.ZodString;
    Description: z.ZodOptional<z.ZodString>;
    Usage: z.ZodOptional<z.ZodString>;
    Examples: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  },
  "strip",
  z.ZodTypeAny,
  CommandModuleMetadata,
  CommandModuleMetadata
> = z.object({
  Name: z
    .string()
    .min(1, "Command name is required.")
    .describe(
      "A short, human-readable label for the command. Shown in help UIs and documentation.",
    ),

  Description: z
    .string()
    .optional()
    .describe(
      "A brief description of what this command does. Appears in help output and introspection tools.",
    ),

  Usage: z
    .string()
    .optional()
    .describe(
      "Optional usage string showing how to invoke this command. If omitted, it will be inferred from schema.",
    ),

  Examples: z
    .array(z.string())
    .optional()
    .describe(
      "Optional example invocations. Each entry should be a CLI string, e.g. 'oi dev --verbose'.",
    ),
});

/**
 * Type inferred from the CommandModuleMetadataSchema, providing type safety when working with
 * command metadata in the application.
 */
export type CommandModuleMetadataSchema = z.infer<
  typeof CommandModuleMetadataSchema
>;
