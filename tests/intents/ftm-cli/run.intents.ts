import { CommandIntents } from "../../test.deps.ts";
import RunCommand from "../../../src/common/cli/ftm-cli/commands/run.ts";

const cliPath = Deno.realPathSync("./test/my-cli/.cli.json");

CommandIntents(
  "Run Command Suite",
  RunCommand.Build(),
  import.meta.resolve("../../../src/common/cli/ftm-cli/.cli.json"),
)
  // === HELLO COMMAND TESTS ===
  .Intent("Run 'hello' command with default args", (int) =>
    int
      .Args(["hello"])
      .Flags({ config: "./test/my-cli/.cli.json" })
      .ExpectLogs(
        `→ With args: ${cliPath} hello`,
        "👋 Hello, world!",
        "🎉 CLI run completed",
      )
      .ExpectExit(0),
  )
  .Intent("Run 'hello' command with a name", (int) =>
    int
      .Args(["hello", "testy"])
      .Flags({ config: "./test/my-cli/.cli.json" })
      .ExpectLogs(
        `→ With args: ${cliPath} hello testy`,
        "👋 Hello, testy!",
        "🎉 CLI run completed",
      )
      .ExpectExit(0),
  )
  .Intent("Run 'hello' command with loud flag", (int) =>
    int
      .Args(["hello", "team"])
      .Flags({
        config: "./test/my-cli/.cli.json",
        loud: true,
      })
      .ExpectLogs(
        `→ With args: ${cliPath} hello team --loud=true`,
        "👋 HELLO, TEAM!",
        "🎉 CLI run completed",
      )
      .ExpectExit(0),
  )

  // === WAVE COMMAND TESTS ===
  .Intent("Run 'wave' command with default args", (int) =>
    int
      .Args(["wave"])
      .Flags({ config: "./test/my-cli/.cli.json" })
      .ExpectLogs(
        `→ With args: ${cliPath} wave`,
        "👋 Waving at friend",
        "🎉 CLI run completed",
      )
      .ExpectExit(0),
  )
  .Intent("Run 'wave' command with a name", (int) =>
    int
      .Args(["wave", "me"])
      .Flags({ config: "./test/my-cli/.cli.json" })
      .ExpectLogs(
        `→ With args: ${cliPath} wave me`,
        "👋 Waving at me",
        "🎉 CLI run completed",
      )
      .ExpectExit(0),
  )
  .Intent("Run 'wave' command with excitement", (int) =>
    int
      .Args(["wave", "you"])
      .Flags({
        config: "./test/my-cli/.cli.json",
        excited: true,
      })
      .ExpectLogs(
        `→ With args: ${cliPath} wave you --excited=true`,
        "👋 Waving at you!!!",
        "🎉 CLI run completed",
      )
      .ExpectExit(0),
  )
  .Intent("Run 'wave' dry run", (int) =>
    int
      .Args(["wave", "nobody"])
      .Flags({
        config: "./test/my-cli/.cli.json",
        "dry-run": true,
      })
      .ExpectLogs(
        `→ With args: ${cliPath} wave nobody --dry-run=true`,
        '🛑 Dry run: "👋 Waving at nobody" would have been printed.',
        "🎉 CLI run completed",
      )
      .ExpectExit(0),
  )
  .Intent("Run 'wave' dry run with excitement", (int) =>
    int
      .Args(["wave", "everyone"])
      .Flags({
        config: "./test/my-cli/.cli.json",
        "dry-run": true,
        excited: true,
      })
      .ExpectLogs(
        `→ With args: ${cliPath} wave everyone --dry-run=true --excited=true`,
        '🛑 Dry run: "👋 Waving at everyone!!!" would have been printed.',
        "🎉 CLI run completed",
      )
      .ExpectExit(0),
  )
  .Run();
