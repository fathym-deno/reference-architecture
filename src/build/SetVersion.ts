import { parseArgs } from "./.deps.ts";
import { exists } from "../common/.exports.ts";
import { loadDenoConfig } from "./loadDenoConfig.ts";

export class SetVersion {
  protected version: string;

  constructor();
  constructor(version: string);
  constructor(denoArgsVersion?: string[] | string) {
    if (typeof denoArgsVersion === "string") {
      this.version = denoArgsVersion;
    } else {
      const { args } = Deno;
      const parsedArgs = parseArgs(args);

      // Get the version from the command-line arguments
      this.version = parsedArgs._[0] as string;
    }

    if (!this.version || typeof this.version !== "string") {
      console.error("Please provide a version number.");
      Deno.exit(1);
    }
  }

  public async Configure(denoFilePath?: string): Promise<void> {
    try {
      denoFilePath = denoFilePath ||
        ((await exists("deno.jsonc")) ? "deno.jsonc" : "deno.json");

      if (!(await exists(denoFilePath))) {
        throw new Deno.errors.NotFound(denoFilePath);
      }

      const config = await loadDenoConfig(denoFilePath);

      // Update the version
      config.version = this.version;

      // Convert the updated config back to JSONC
      const updatedData = JSON.stringify(config, null, 2);

      // Write the updated JSON back to the file
      await Deno.writeTextFile(denoFilePath, updatedData);

      console.log(`Version updated to ${this.version}`);
    } catch (error) {
      console.error("An error occurred while updating the version:", error);
      Deno.exit(1);
    }
  }
}
