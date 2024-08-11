import { parseArgs } from "jsr:@std/cli@^1.0.3";
import { exists } from "../utils/path/exists.ts";
import { loadDenoConfig } from "../utils/deno/loadDenoConfig.ts";

const { args } = Deno;
const parsedArgs = parseArgs(args);

// Get the version from the command-line arguments
const newVersion = parsedArgs._[0];

if (!newVersion || typeof newVersion !== "string") {
  console.error("Please provide a version number.");
  Deno.exit(1);
}

const filePath = await exists("deno.jsonc") ? "deno.jsonc" : "deno.json";

try {
  const config = await loadDenoConfig(filePath);

  // Update the version
  config.version = newVersion;

  // Convert the updated config back to JSONC
  const updatedData = JSON.stringify(config, null, 2);

  // Write the updated JSON back to the file
  await Deno.writeTextFile(filePath, updatedData);

  console.log(`Version updated to ${newVersion}`);
} catch (error) {
  console.error("An error occurred while updating the version:", error);
  Deno.exit(1);
}
