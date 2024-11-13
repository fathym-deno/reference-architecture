import {
  ConsoleHandler,
  type LevelName,
  type Logger,
  type LoggerConfig,
} from "../../src/log/.deps.ts";
import { LoggingProvider } from "../../src/log/LoggingProvider.ts";

class TestLoggingProvider extends LoggingProvider {
  public get PackageFake(): Logger {
    return this.LoggerSync("fake", true);
  }

  public get PackageTest(): Logger {
    return this.LoggerSync("test", true);
  }

  constructor() {
    const loggingPackages = ["@fathym/common", "@fathym/common/test"];

    super(import.meta, {
      handlers: {
        console: new ConsoleHandler("DEBUG"),
      },
      loggers: {
        default: {
          level: (Deno.env.get("LOGGING_DEFAULT_LEVEL") as LevelName) ??
            "DEBUG",
          handlers: ["console"],
        },

        ...loggingPackages.reduce((acc, name) => {
          const logLevelName = Deno.env.get("LOGGING_PACKAGE_LEVEL") ??
            Deno.env.get("LOGGING_DEFAULT_LEVEL") ??
            "DEBUG";

          acc[name] = {
            level: logLevelName as LevelName,
            handlers: ["console"],
          };
          return acc;
        }, {} as Record<string, LoggerConfig>),
      },
    });
  }
}

Deno.test("Basic Logging", async (t) => {
  const logging = new TestLoggingProvider();

  await t.step("Package Logger", () => {
    const logger = logging.Package;
    logger.debug("This is a debug message");
    logger.info("This is an info message");
    logger.warn("This is a warning message");
    logger.error("This is an error message");
    logger.critical("This is a critical message");
  });

  await t.step("Package Logger - Named", () => {
    const logger = logging.PackageTest;
    logger.debug("This is a named debug message");
    logger.info("This is a named info message");
    logger.warn("This is a named warning message");
    logger.error("This is a named error message");
    logger.critical("This is a named critical message");
  });

  await t.step("Package Logger - Named - Not Configed", () => {
    const logger = logging.PackageFake;
    logger.debug("THIS SHOULD NOT SHOW");
    logger.info("THIS SHOULD NOT SHOW");
    logger.warn("THIS SHOULD NOT SHOW");
    logger.error("THIS SHOULD NOT SHOW");
    logger.critical("THIS SHOULD NOT SHOW");
  });

  await t.step("Package Logger - Time Check", () => {
    console.time("package-logger-time-check");
    console.time("package-logger-time-check: package");
    console.time("package-logger-time-check: log");

    const logger = logging.Package;

    console.timeEnd("package-logger-time-check: package");

    logger.debug("This is a debug message");

    console.timeEnd("package-logger-time-check");
    console.timeEnd("package-logger-time-check: log");
  });
});
