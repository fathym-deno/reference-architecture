/**
 * Entry point for the version management script.
 * @module
 *
 * @example Deno task script
 * ```command prompt
 * deno run -A jsr:@fathym/common/build/version -- 0.0.0
 * ```
 */

// import { getPackageLogger } from "./.deps.ts";
import { SetVersion } from "./SetVersion.ts";

/**
 * The version that was used to configure the deno file.
 */
let version: string = "";

// const logger = await getPackageLogger(import.meta, "build");

try {
  const setVersion: SetVersion = new SetVersion();

  version = await setVersion.Configure();
} catch (error) {
  console.error("There was an error while setting the version.");
  console.error(error);
}

export { version };

if (version) {
  Deno.exit(0);
} else {
  Deno.exit(1);
}
