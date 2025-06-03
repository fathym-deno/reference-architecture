import { parseArgs, resolve, join, exists, dirname } from './.deps.ts';
import type { CLIParsedResult } from './CLIParsedResult.ts';
import type { CLIConfig } from './CLIConfig.ts';

export class CLIInvocationParser implements CLIInvocationParser {
public async ParseInvocation(
  config: CLIConfig,
  args: string[],
  configPath: string
): Promise<CLIParsedResult> {
  const cliConfigDir = dirname(configPath);
  
    const parsed = parseArgs(args, { boolean: true });
    const { _, ...flags } = parsed;
    const positional = _.map(String);

    const keyParts = positional.filter((p) => !p.startsWith('-'));
    const key = keyParts.join('/');

    const baseCommandDir = resolve(cliConfigDir, config.Commands ?? './commands');
    const baseTemplatesDir = resolve(
      cliConfigDir,
      config.Templates ?? './.templates'
    );

    const initPath = join(cliConfigDir, '.cli.init.ts');
    const hasInit = await exists(initPath);

    return {
      parsed,
      flags,
      positional,
      key,
      config,
      baseCommandDir,
      baseTemplatesDir,
      initPath: hasInit ? initPath : undefined,
    };
  }
}
