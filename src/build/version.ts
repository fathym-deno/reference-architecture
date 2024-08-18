import { SetVersion } from "./SetVersion.ts";

/**
 * Entry point for the version management script.
 * @module
 */
const setVersion: SetVersion = new SetVersion();

await setVersion.Configure();

export { setVersion };
