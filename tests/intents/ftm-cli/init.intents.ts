import { CommandIntents } from '../../test.deps.ts';
import InitCommand from '../../../src/common/cli/ftm-cli/commands/init.ts';

CommandIntents(
  'Init Command Suite',
  InitCommand.Build(),
  import.meta.resolve('../../../src/common/cli/ftm-cli/.cli.json')
)
  .Intent("Init with default 'hello' template", (int) =>
    int
      .Args(['./test/hello'])
      .Flags({})
      .ExpectLogs(
        `Project created from "hello" template.`,
        '📂 Initialized at:'
      )
      .ExpectExit(0)
  )
  .Run();
