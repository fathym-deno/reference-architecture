import { zodToJsonSchema } from './.deps.ts';
import { CLIConfigSchema } from './CLIConfig.ts';
import { join } from 'jsr:@std/path';

/**
 * Emits the JSON Schema for CLIConfig into the root-level `schemas/` folder.
 * This is useful for IDE validation, `$schema` linking, or docs tooling.
 */
export async function emitCLIConfigSchema(
  fileName = 'cli.schema.json',
  outputDir = '../../../schemas'
) {
  const schema = zodToJsonSchema(CLIConfigSchema, 'CLIConfig');

  // Ensure the output folder exists
  await Deno.mkdir(outputDir, { recursive: true });

  const outPath = join(outputDir, fileName);

  await Deno.writeTextFile(outPath, JSON.stringify(schema, null, 2));

  console.log(`✅ CLI config schema written to ${outPath}`);
}

// Run as script
if (import.meta.main) {
  await emitCLIConfigSchema();
}
