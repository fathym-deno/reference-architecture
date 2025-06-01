import { fromFileUrl } from 'jsr:@std/path@^1.0.9';
import { stripColor } from 'jsr:@std/fmt@^0.221.0/colors';
import { assertMatch } from '../../test.deps.ts';
import { CLI } from '../../../src/common/cli/CLI.ts';

function createTestCLI() {
  return new CLI({});
}

function captureLogs(fn: () => Promise<void>): Promise<string> {
  const originalLog = console.log;
  const originalError = console.error;
  let output = '';

  console.log = (...args: unknown[]) => {
    output += args.map((a) => String(a)).join(' ') + '\n';
  };
  console.error = (...args: unknown[]) => {
    output += args.map((a) => String(a)).join(' ') + '\n';
  };

  return fn()
    .finally(() => {
      console.log = originalLog;
      console.error = originalError;
    })
    .then(() => output);
}

Deno.test('Test CLI – Help Coverage', async (t) => {
  const configPath = fromFileUrl(import.meta.resolve('./test-cli/.cli.json'));
  const cli = createTestCLI();

  await t.step('Root Help', async () => {
    const logs = await captureLogs(() => cli.RunFromConfig(configPath, []));
    const text = stripColor(logs);
    assertMatch(text, /📘 Test CLI CLI v0\.0\.0/);
    assertMatch(text, /Usage:/);
    assertMatch(text, /Available Commands/);
    assertMatch(text, /dev - Development Mode/);
    assertMatch(text, /Available Groups/);
    assertMatch(text, /scaffold - scaffold/);
  });

  await t.step('Group Help: scaffold', async () => {
    const logs = await captureLogs(() =>
      cli.RunFromConfig(configPath, ['scaffold', '--help'])
    );
    const text = stripColor(logs);
    assertMatch(text, /📘 Group: scaffold/);
    assertMatch(text, /Available Commands/);
    assertMatch(text, /scaffold\/connection - Scaffold Connection/);
    assertMatch(text, /Available Groups/);
    assertMatch(text, /scaffold\/cloud - Scaffold new Open/);
  });

  // await t.step('Nested Group Help: scaffold/cloud', async () => {
  //   const logs = await captureLogs(() =>
  //     cli.RunFromConfig(configPath, ['scaffold/cloud', '--help'])
  //   );
  //   const text = stripColor(logs);
  //   assertMatch(text, /📘 Group: scaffold\/cloud/);
  //   assertMatch(text, /📘 Command: scaffold\/cloud - Scaffold Cloud/);
  //   assertMatch(text, /Available Commands/);
  //   assertMatch(text, /scaffold\/cloud\/aws - Scaffold AWS/);
  //   assertMatch(text, /scaffold\/cloud\/azure - Scaffold Azure/);
  // });

  // await t.step('Leaf Command Help: scaffold/cloud/aws', async () => {
  //   const logs = await captureLogs(() =>
  //     cli.RunFromConfig(configPath, ['scaffold/cloud/aws', '--help'])
  //   );
  //   const text = stripColor(logs);
  //   assertMatch(text, /📘 Command: scaffold\/cloud\/aws - Scaffold AWS/);
  //   assertMatch(text, /Usage:/);
  //   assertMatch(text, /Examples:/);
  // });

  // await t.step('Leaf Command Help: scaffold/cloud/azure', async () => {
  //   const logs = await captureLogs(() =>
  //     cli.RunFromConfig(configPath, ['scaffold/cloud/azure', '--help'])
  //   );
  //   const text = stripColor(logs);
  //   assertMatch(text, /📘 Command: scaffold\/cloud\/azure - Scaffold Azure/);
  //   assertMatch(text, /Usage:/);
  //   assertMatch(text, /Examples:/);
  // });

  // await t.step('Command Help: scaffold/connection', async () => {
  //   const logs = await captureLogs(() =>
  //     cli.RunFromConfig(configPath, ['scaffold/connection', '--help'])
  //   );
  //   const text = stripColor(logs);
  //   assertMatch(text, /📘 Command: scaffold\/connection - Connection/);
  //   assertMatch(text, /Usage:/);
  //   assertMatch(text, /Examples:/);
  // });

  // await t.step('Command Help: dev', async () => {
  //   const logs = await captureLogs(() =>
  //     cli.RunFromConfig(configPath, ['dev', '--help'])
  //   );
  //   const text = stripColor(logs);
  //   assertMatch(text, /📘 Command: dev - Development Mode/);
  //   assertMatch(text, /Usage:/);
  //   assertMatch(text, /Examples:/);
  // });

  // await t.step('Unknown Command Help: scaffold/clod', async () => {
  //   const logs = await captureLogs(() =>
  //     cli.RunFromConfig(configPath, ['scaffold/clod'])
  //   );
  //   const text = stripColor(logs);
  //   assertMatch(text, /❌ Unknown command: scaffold\/clod/);
  //   assertMatch(text, /💡 Did you mean: scaffold\/cloud\?/);
  //   assertMatch(text, /test <command> \[options\]/);
  // });
});
