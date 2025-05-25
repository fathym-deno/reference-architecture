import { z } from './.deps.ts';

/**
 * Zod schema representing the CLIConfig shape.
 * Used for validation, parsing, documentation, and JSON Schema generation.
 */
export const CLIConfigSchema = z.object({
  Name: z.string()
    .min(1, 'CLI name is required.')
    .describe('A user-facing, friendly name for the CLI. Shown in help output and documentation headers.'),

  Tokens: z.array(z.string())
    .min(1, 'At least one CLI token is required.')
    .describe('All valid CLI tokens (aliases) that can invoke this tool. Examples: ["openindustrial", "oi"]'),

  Version: z.string()
    .min(1, 'CLI version is required.')
    .describe('The current version of the CLI. Used in logs, help, and update flows.'),

  Description: z.string()
    .optional()
    .describe('Optional description for the CLI. Shown in help output.'),

  Commands: z.string()
    .optional()
    .default('./commands')
    .describe('Relative or absolute path to the root folder of command modules. Defaults to "./commands".'),

  Help: z.object({
    Usage: z.string()
      .optional()
      .describe('Custom usage string shown in help. If omitted, may be inferred.'),
    Examples: z.array(z.string())
      .optional()
      .describe('List of example command invocations shown in CLI help.'),
  })
  .optional()
  .describe('Optional help customization block for usage and examples.'),
});

/**
 * Fully inferred CLIConfig type from the schema.
 * Used throughout the system to ensure consistency.
 */
export type CLIConfig = z.infer<typeof CLIConfigSchema>;
