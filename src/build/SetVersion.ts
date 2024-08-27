import { getPackageLogger, parseArgs } from "./.deps.ts";
import { loadDenoConfig } from "./loadDenoConfig.ts";

/**
 * SetVersion provides an interface for setting the version of a Deno project.
 * @module
 *
 * @example From direct import
 * ```typescript
 * import { SetVersion } from '@fathym/common/build';
 *
 * const setVersion = new SetVersion();
 *
 * await setVersion.Configure();
 * ```
 */
export class SetVersion {
  protected version: string;

  /**
   * Creates a new SetVersion instance with the version pulled from the first deno arg.
   *
   * @example From direct import
   * ```typescript
   * import { SetVersion } from '@fathym/common/build';
   *
   * const setVersion = new SetVersion();
   * ```
   */
  constructor();

  /**
   * Creates a new SetVersion instance with the provided version number.
   *
   * @param version - The version number to set.
   *
   * @example From direct import
   * ```typescript
   * import { SetVersion } from '@fathym/common/build';
   *
   * const setVersion = new SetVersion('0.0.0');
   * ```
   */
  constructor(version: string);

  /**
   * Creates a new SetVersion instance.
   *
   * @param denoArgsVersion - The version number to set or the args containing the version.
   *
   * @example From direct import
   * ```typescript
   * import { SetVersion } from '@fathym/common/build';
   *
   * const setVersion = new SetVersion(Deno.args);
   * ```
   */
  constructor(denoArgsVersion?: string[] | string) {
    if (typeof denoArgsVersion === "string") {
      this.version = denoArgsVersion;
    } else {
      if (!denoArgsVersion) {
        denoArgsVersion = Deno.args;
      }

      const parsedArgs = parseArgs(denoArgsVersion);

      // Get the version from the command-line arguments
      this.version = parsedArgs._[0] as string;
    }

    if (!this.version || typeof this.version !== "string") {
      console.error("Please provide a version number.");

      throw new Deno.errors.NotFound("Please provide a version number.");
    }
  }

  /**
   * Updates the version in the specified deno configuration file.
   *
   * @param denoCfgPath - The path to the deno configuration file. If not provided, it will search for it in the current working directory.
   *
   * @example From direct import
   * ```typescript
   * import { SetVersion } from '@fathym/common/build';
   *
   * const setVersion = new SetVersion();
   *
   * await setVersion.Configure();
   * ```
   */
  public async Configure(denoCfgPath?: string): Promise<string> {
    const logger = await getPackageLogger("build");

    try {
      const { Config: config, DenoConfigPath: dcp } = await loadDenoConfig(
        denoCfgPath,
      );

      denoCfgPath = dcp;

      // Update the version
      config.version = this.version;

      // Convert the updated config back to JSONC
      const updatedData = JSON.stringify(config, null, 2);

      // Write the updated JSON back to the file
      await Deno.writeTextFile(denoCfgPath, updatedData);

      logger.debug(`Version updated to ${this.version}`);

      return config.version;
    } catch (error) {
      throw error;
    }
  }
}
