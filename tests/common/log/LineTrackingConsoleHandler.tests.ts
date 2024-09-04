import { LineTrackingConsoleHandler } from "../../../src/common/log/LineTrackingConsoleHandler.ts";
import { LoggingProvider } from "../../../src/common/log/LoggingProvider.ts";
import { delay } from "../../test.deps.ts";

Deno.test("LineTrackingConsoleHandler Tests", async (t) => {
  const lp = new LoggingProvider({
    handlers: {
      lineTracking: new LineTrackingConsoleHandler("DEBUG"),
    },
    loggers: {
      default: {
        level: "DEBUG",
        handlers: ["lineTracking"],
      },
    },
  });

  const logger = await lp.Logger();

  await t.step("Change line", async () => {
    logger.debug("Hello world");
    logger.info(123456);
    logger.warn(true);
    logger.error({ foo: "bar", fizz: "bazz" });
    logger.critical("500 Internal server error");

    logger.debug("This is the starting line");

    let changing = "[key:replacing]Replacing this line.";

    logger.debug(changing);

    logger.debug("This is the seed line");

    let count = 10;

    while (count-- > 0) {
      await delay(2500);

      changing += ".";

      logger.debug(changing);

      logger.debug(`This is the repeating line: ${count}`);
    }

    logger.info("[key:replacing]Replaced the line");
  });
});
