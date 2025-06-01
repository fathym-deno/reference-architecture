// src/common/cli/emit-cli-schemas.ts

import { CLIConfigSchema } from "../src/common/cli/CLIConfig.ts";
import { CommandModuleMetadataSchema } from "../src/common/cli/commands/CommandModuleMetadata.ts";
import { emitSchema } from "../src/common/cli/emitSchema.ts";

// Run directly as a Deno script
if (import.meta.main) {
  console.log("📤 Emitting CLI-related JSON Schemas...\n");

  await emitSchema(CLIConfigSchema, "CLIConfig");

  await emitSchema(CommandModuleMetadataSchema, "CommandModuleMetadata");

  console.log("\n✅ All schemas written to ./schemas/");
}
