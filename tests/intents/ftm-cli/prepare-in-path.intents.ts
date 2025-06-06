import { CommandIntent } from "../../test.deps.ts";
import BuildCommand from "../../../src/common/cli/ftm-cli/commands/build.ts";
import CompileCommand from "../../../src/common/cli/ftm-cli/commands/compile.ts";
import InstallCommand from "../../../src/common/cli/ftm-cli/commands/install.ts";

CommandIntent(
  "Prepare ftm-cli: build",
  BuildCommand.Build(),
  import.meta.resolve("../../../src/common/cli/ftm-cli/.cli.json"),
)
  .Args([])
  .Flags({
    config: "./src/common/cli/ftm-cli/.cli.json",
  })
  .ExpectLogs(
    "📦 Embedded templates →",
    "📘 Embedded command entries →",
    "🧩 Scaffolder rendered build-static template to ./.build",
    "Build complete! Run `ftm compile` on .build/cli.ts to finalize.",
  )
  .ExpectExit(0)
  .Run();

CommandIntent(
  "Prepare ftm-cli: compile",
  CompileCommand.Build(),
  import.meta.resolve("../../../src/common/cli/ftm-cli/.cli.json"),
)
  .Args([])
  .Flags({
    entry: "./src/common/cli/ftm-cli/.build/cli.ts",
  })
  .ExpectLogs(
    "🔧 Compiling CLI for:",
    "✅ Compiled:",
    "👉 To install, run: `your-cli install --from",
  )
  .ExpectExit(0)
  .Run();

CommandIntent(
  "Prepare ftm-cli: install",
  InstallCommand.Build(),
  import.meta.resolve("../../../src/common/cli/ftm-cli/.cli.json"),
)
  .Args([])
  .Flags({
    config: "./src/common/cli/ftm-cli/.cli.json",
    useHome: true,
  })
  .ExpectLogs(
    "✅ Installed: ", // main binary copy success
    "🎉 CLI installed successfully", // final success message
  )
  .ExpectExit(0)
  .Run();
