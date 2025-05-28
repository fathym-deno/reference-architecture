// src/common/cli/emit-cli-schemas.ts

import { CLIConfig } from '../src/common/cli/CLIConfig.ts';
import { CommandModuleMetadata } from '../src/common/cli/commands/CommandModuleMetadata.ts';
import { emitSchema } from '../src/common/cli/emitSchema.ts';

// Run directly as a Deno script
if (import.meta.main) {
  console.log('📤 Emitting CLI-related JSON Schemas...\n');

  await emitSchema(CLIConfig, 'CLIConfig');

  await emitSchema(CommandModuleMetadata, 'CommandModuleMetadata');

  console.log('\n✅ All schemas written to ./schemas/');
}
