import { fromFileUrl } from 'jsr:@std/path@^1.0.9';
import { stripColor } from 'jsr:@std/fmt@^0.221.0/colors';
import { assertMatch } from '../../test.deps.ts';
import { CLI } from '../../../src/common/cli/CLI.ts';

/**
 * Create a test CLI instance with default behavior.
 */
function createTestCLI() {
  return new CLI({});
}

/**
 * Capture all stdout and stderr logs during CLI execution.
 */
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
    assertMatch(text, /Usage:\n\s+test <command> \[options\]/);
    assertMatch(text, /Examples:/);
    assertMatch(text, /🔸 Available Commands/);
    assertMatch(text, /🔸 Available Groups/);
  });

  // await t.step('Group Help: scaffold', async () => {
  //   const logs = await captureLogs(() =>
  //     cli.RunFromConfig(configPath, ['scaffold', '--help'])
  //   );
  //   const text = stripColor(logs);

  //   assertMatch(text, /📘 Group: scaffold/);
  //   assertMatch(text, /Available Groups/);
  // });

  // await t.step('Nested Group Help: scaffold/cloud', async () => {
  //   const logs = await captureLogs(() =>
  //     cli.RunFromConfig(configPath, ['scaffold/cloud', '--help'])
  //   );
  //   const text = stripColor(logs);

  //   assertMatch(text, /📘 Group: scaffold\/cloud/);
  //   assertMatch(text, /📘 Command: Scaffold Cloud/);
  //   // Only match if child commands actually exist:
  //   // assertMatch(text, /Available Commands/);
  // });

  // await t.step('Command Help: scaffold/cloud/aws', async () => {
  //   const logs = await captureLogs(() =>
  //     cli.RunFromConfig(configPath, ['scaffold/cloud/aws', '--help'])
  //   );
  //   const text = stripColor(logs);

  //   assertMatch(text, /📘 Command: Scaffold AWS/);
  //   assertMatch(text, /Usage:/);
  //   assertMatch(text, /Examples:/);
  // });

  // await t.step('Unknown command fallback', async () => {
  //   const logs = await captureLogs(() =>
  //     cli.RunFromConfig(configPath, ['scaffold/clod'])
  //   );
  //   const text = stripColor(logs);

  //   assertMatch(text, /❌ Unknown command: scaffold\/clod/);
  //   assertMatch(text, /💡 Did you mean: scaffold\/cloud\?/);
  //   assertMatch(text, /test <command> \[options\]/); // fallback help rendered
  // });
});
