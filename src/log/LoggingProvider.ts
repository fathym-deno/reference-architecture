import { getLogger, type LogConfig, type Logger, setup } from "./.deps.ts";
import { getPackageLogger, getPackageLoggerSync } from "./getPackageLogger.ts";

export class LoggingProvider {
  constructor(protected setupConfig: LogConfig) {
    setup(setupConfig);
  }

  public async Logger(name?: string, usePackage?: boolean): Promise<Logger> {
    return usePackage ? await getPackageLogger(name) : getLogger(name);
  }

  public LoggerSync(name?: string, usePackage?: boolean): Logger {
    return usePackage ? getPackageLoggerSync(name) : getLogger(name);
  }
}
