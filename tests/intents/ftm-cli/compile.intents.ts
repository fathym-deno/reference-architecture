import { CommandIntent } from "../../test.deps.ts";
import CompileCommand from "../../../src/common/cli/ftm-cli/commands/compile.ts";

CommandIntent(
  "Compile works with token config",
  CompileCommand.Build(),
  import.meta.resolve("../../../src/common/cli/ftm-cli/.cli.json"),
)
  .Args([])
  .Flags({ entry: "./test/.build/cli.ts" })
  .ExpectLogs("🔧 Compiling", "🎉 All CLI binaries compiled")
  .ExpectExit(0)
  .Run();
