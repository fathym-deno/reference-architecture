import { CommandIntent } from "../../intents/CommandIntent.ts";
import CompileCommand from "../commands/compile.ts";

CommandIntent(
  "Compile works with token config",
  CompileCommand.Build(),
  import.meta.url,
)
  .Args([])
  .Flags({ entry: "./test/.build/cli.ts" })
  .ExpectLogs("🔧 Compiling", "🎉 All CLI binaries compiled")
  .ExpectExit(0)
  .Run();
