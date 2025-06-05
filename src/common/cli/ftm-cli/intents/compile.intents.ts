import { CommandIntent } from "../../intents/CommandIntent.ts";
import CompileCommand from "../commands/compile.ts";

export const compileWithToken = CommandIntent(
  CompileCommand.Build(),
  "Compile works with token config",
  import.meta.url,
)
  .Args([])
  .Flags({ entry: "./test/.build/cli.ts" })
  .ExpectLogs("🔧 Compiling", "🎉 All CLI binaries compiled")
  .ExpectExit(0)
  .Run();
