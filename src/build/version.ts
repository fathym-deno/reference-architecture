/**
 * Entry point for the version management script.
 * @module
 */

import { SetVersion } from "./SetVersion.ts";

const setVersion = new SetVersion();

await setVersion.Configure();
