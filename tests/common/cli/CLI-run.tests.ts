// tests/common/cli/cli-exec.test.ts

import { fromFileUrl } from 'jsr:@std/path@^1.0.9';
import { assertMatch, captureLogs, createTestCLI } from '../../test.deps.ts';
import { stripColor } from 'jsr:@std/fmt@^0.221.0/colors';

Deno.test('Test CLI – Execution Coverage', async (t) => {
  const configPath = fromFileUrl(import.meta.resolve('./test-cli/.cli.json'));
  const cli = createTestCLI();

  await t.step('Execute: scaffold/cloud/aws', async () => {
    const logs = await captureLogs(() =>
      cli.RunFromConfig(configPath, ['scaffold/cloud/aws'])
    );
    const text = stripColor(logs);

    assertMatch(text, /running "scaffold\/cloud\/aws"/i);
    assertMatch(text, /✅.*completed/i);
  });

  await t.step('Execute: scaffold/cloud/azure', async () => {
    const logs = await captureLogs(() =>
      cli.RunFromConfig(configPath, ['scaffold/cloud/azure'])
    );
    const text = stripColor(logs);

    assertMatch(text, /running "scaffold\/cloud\/azure"/i);
    assertMatch(text, /✅.*completed/i);
  });

  await t.step('Execute: scaffold/connection', async () => {
    const logs = await captureLogs(() =>
      cli.RunFromConfig(configPath, ['scaffold/connection'])
    );
    const text = stripColor(logs);

    assertMatch(text, /running "scaffold\/connection"/i);
    assertMatch(text, /✅.*completed/i);
  });

  await t.step('Execute: dev', async () => {
    const logs = await captureLogs(() =>
      cli.RunFromConfig(configPath, ['dev'])
    );
    const text = stripColor(logs);

    assertMatch(text, /running "dev"/i);
    assertMatch(text, /✅.*completed/i);
  });
});
