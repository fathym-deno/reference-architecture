import { getLogger, type LogConfig, type Logger, setup } from "./.deps.ts";

export class LoggingProvider {
  constructor(protected setupConfig: LogConfig) {
    setup(setupConfig);
  }

  public Logger(name?: string): Logger {
    return getLogger(name);
  }
}
