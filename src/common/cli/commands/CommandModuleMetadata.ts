import { z } from '../.deps.ts';

/**
 * Zod schema representing the metadata for a single CLI command module.
 * Used for validation, docs, help output, and .metadata.json governance.
 */
export const CommandModuleMetadata = z.object({
  Name: z
    .string()
    .min(1, 'Command name is required.')
    .describe(
      'A short, human-readable label for the command. Shown in help UIs and documentation.'
    ),

  Description: z
    .string()
    .optional()
    .describe(
      'A brief description of what this command does. Appears in help output and introspection tools.'
    ),

  Usage: z
    .string()
    .optional()
    .describe(
      'Optional usage string showing how to invoke this command. If omitted, it will be inferred from schema.'
    ),

  Examples: z
    .array(z.string())
    .optional()
    .describe(
      "Optional example invocations. Each entry should be a CLI string, e.g. 'oi dev --verbose'."
    ),
});

/**
 * Inferred runtime type from the CommandModuleMetadata schema.
 * Used for programmatic access, editing, and validation.
 */
export type CommandModuleMetadata = z.infer<typeof CommandModuleMetadata>;
