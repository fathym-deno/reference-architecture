import { type Color, ConsoleHandler, Kia, type LogRecord } from "./.deps.ts";

export class LineTrackingConsoleHandler extends ConsoleHandler {
  private oraTracker: Map<string, Kia> = new Map();

  handle(logRecord: LogRecord): void {
    let { msg } = logRecord;

    const logKeyMatch = msg.match(/^\[key:(.+?)\]/);

    msg = msg.replace(/^\[key:.+?\]/, "").trim();

    const logKey = logKeyMatch ? logKeyMatch[1] : undefined;

    if (logKey) {
      let kia = this.oraTracker.get(logKey);

      const logLevel = logRecord.levelName;

      let color: Color | undefined = undefined;

      switch (logLevel) {
        case "CRITICAL": {
          color = "red";
          break;
        }

        case "ERROR": {
          color = "magenta";
          break;
        }

        case "INFO": {
          color = "blue";
          break;
        }

        case "WARN": {
          color = "yellow";
          break;
        }
      }

      // if (color) {
      //   const colorHook = color;

      //   logLevel = Colors[colorHook](logLevel);

      //   msg = Colors[colorHook](msg);
      // }

      if (kia === undefined) {
        kia = new Kia({
          color: color,
          prefixText: logLevel,
          text: msg,
        });

        this.oraTracker.set(logKey, kia);

        kia.start();
      } else {
        kia.set({
          color,
          prefixText: logLevel,
          text: msg,
        });

        this.oraTracker.set(logKey, kia);
      }
    } else {
      // Normal logging
      super.handle(logRecord);
    }
  }
}
