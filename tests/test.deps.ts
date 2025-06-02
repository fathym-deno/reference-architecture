import { CLI } from "../src/common/cli/CLI.ts";

export * from "jsr:@std/assert@1.0.3";
export { delay } from "jsr:@std/async@1.0.4/delay";

export { z, ZodSchema } from "../src/third-party/zod/.exports.ts";
export { zodToJsonSchema } from "npm:zod-to-json-schema@3.24.5";

export * as Colors from "jsr:@std/fmt@1.0.1/colors";

export { type CommandModuleMetadata } from "../src/common/cli/.exports.ts";

export function createTestCLI() {
  return new CLI({});
}

export function captureLogs(fn: () => Promise<void>): Promise<string> {
  const originalLog = console.log;
  const originalError = console.error;
  let output = "";

  console.log = (...args: unknown[]) => {
    output += args.map((a) => String(a)).join(" ") + "\n";
  };
  console.error = (...args: unknown[]) => {
    output += args.map((a) => String(a)).join(" ") + "\n";
  };

  return fn()
    .finally(() => {
      console.log = originalLog;
      console.error = originalError;
    })
    .then(() => output);
}
