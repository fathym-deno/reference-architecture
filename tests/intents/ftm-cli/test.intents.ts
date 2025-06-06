import { CommandIntents } from "../../test.deps.ts";
import TestCommand from "../../../src/common/cli/ftm-cli/commands/test.ts";

CommandIntents(
  "Test Command Suite",
  TestCommand.Build(),
  import.meta.resolve("../../../src/common/cli/ftm-cli/.cli.json"),
)
  .Intent("Run default CLI test file", (int) =>
    int
      .Args([undefined]) // defaults to test/my-cli/intents/.intents.ts
      .Flags({
        config: "./test/my-cli/.cli.json",
      })
      .ExpectLogs(
        "🧪 Running tests from:",
        "➡️  deno test -A",
        "✅ Tests passed successfully",
      )
      .ExpectExit(0))
  .Intent("Run a specific test file with filter", (int) =>
    int
      .Args(["./intents/.intents.ts"])
      .Flags({
        config: "./test/my-cli/.cli.json",
        filter: "hello",
      })
      .ExpectLogs(
        "🧪 Running tests from:",
        "➡️  deno test -A --filter=hello",
        "✅ Tests passed successfully",
      )
      .ExpectExit(0))
  .Intent("Run tests with coverage and no type check", (int) =>
    int
      .Args([undefined])
      .Flags({
        config: "./test/my-cli/.cli.json",
        coverage: "./coverage",
        "no-check": true,
      })
      .ExpectLogs(
        "🧪 Running tests from:",
        "➡️  deno test -A --coverage=./coverage --no-check",
        "✅ Tests passed successfully",
      )
      .ExpectExit(0))
  .Run();
