import { CommandIntents } from "../../intents/CommandIntents.ts";
import InitCommand from "../commands/init.ts";

const cmd = InitCommand.Build();
const origin = import.meta.url;

CommandIntents("Init Command Suite", cmd, origin)
  .Intent("Init with default 'hello' template", (int) =>
    int
      .Args(["./test/hello"])
      .Flags({})
      .ExpectLogs(
        `Project created from "hello" template.`,
        "📂 Initialized at:",
      )
      .ExpectExit(0))
  .Intent("Init with custom 'web' template", (int) =>
    int
      .Args(["../../../test/web"])
      .Flags({ template: "web" })
      .ExpectLogs(
        `Project created from "web" template.`,
        "📂 Initialized at:",
      )
      .ExpectExit(0))
  .Intent("Init into current directory with default template", (int) =>
    int
      .Args(["."])
      .Flags({})
      .ExpectLogs(
        `Project created from "hello" template.`,
        "📂 Initialized at:",
      )
      .ExpectExit(0))
  .Intent("Init with explicit baseTemplatesDir", (int) =>
    int
      .Args(["../../../test/api"])
      .Flags({
        template: "api",
        baseTemplatesDir: "./.templates",
      })
      .ExpectLogs(
        `Project created from "api" template.`,
        "📂 Initialized at:",
      )
      .ExpectExit(0))
  .Run();
