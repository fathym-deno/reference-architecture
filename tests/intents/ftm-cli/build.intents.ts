import { CommandIntents } from "../../test.deps.ts";
import BuildCommand from "../../../src/common/cli/ftm-cli/commands/build.ts";

CommandIntents(
  "Build Command Suite",
  BuildCommand.Build(),
  import.meta.resolve("../../../src/common/cli/ftm-cli/.cli.json"),
)
  .Intent("Build CLI from scaffolded config", (int) =>
    int
      .Args([])
      .Flags({
        config: "./test/my-cli/.cli.json",
      })
      .ExpectLogs(
        "📦 Embedded templates →",
        "📘 Embedded command entries →",
        "🧩 Scaffolder rendered build-static template to ./.build",
        "Build complete! Run `ftm compile` on .build/cli.ts to finalize.",
      )
      .ExpectExit(0))
  .Run();
