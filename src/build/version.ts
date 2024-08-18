/**
 * Entry point for the version management script.
 * @module
 * ```command prompt
 * deno run -A jsr:@fathym/common/build/version -- 0.0.0
 * ```
 */

import { SetVersion } from "./SetVersion.ts";

let version: string = "";

try {
  const setVersion: SetVersion = new SetVersion();

  version = await setVersion.Configure();
} catch (error) {
  console.log(error);
}

// export { version };

if (version) {
  Deno.exit(0);
} else {
  Deno.exit(1);
}
