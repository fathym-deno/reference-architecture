export function captureLogs(
  fn: () => Promise<void>,
  useOrig: boolean = false,
): Promise<string> {
  const originalLog = console.log;
  const originalError = console.error;
  let output = "";

  console.log = (...args: unknown[]) => {
    output += args.map((a) => String(a)).join(" ") + "\n";

    if (useOrig) originalLog(args);
  };
  console.error = (...args: unknown[]) => {
    output += args.map((a) => String(a)).join(" ") + "\n";

    if (useOrig) originalError(args);
  };

  return fn()
    .finally(() => {
      console.log = originalLog;
      console.error = originalError;
    })
    .then(() => output);
}
