import { CLIInitFn } from '../../../../src/common/cli/CLIInitFn.ts';

export interface SayHello {
  Speak(name: string): string;
}

export class DefaultSayHello implements SayHello {
  Speak(name: string): string {
    return `Hello, ${name}!`;
  }
}

export default (async (ioc, config) => {
  ioc.Register(() => new DefaultSayHello(), {
    Type: ioc.Symbol('SayHello'),
  });
}) as CLIInitFn;
