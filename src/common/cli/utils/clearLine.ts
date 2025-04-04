import type { WriterSync } from "jsr:@std/io@0.224.6/types";
import { writeAllSync } from "jsr:@std/io@0.224.6/write-all";

/**
 * Clears the line and performs a carriage return
 */
export function clearLine(
  writer: WriterSync,
  encoder: TextEncoder,
  lineCount: number = 1,
  startLine?: number,
): void {
  if (startLine !== undefined) {
    writeAllSync(writer, encoder.encode(`\u001B[${startLine}H`));
  } else {
    writeAllSync(writer, encoder.encode(`\u001B[${lineCount}F`));
  }

  for (let i = 0; i < lineCount; i++) {
    writeAllSync(writer, encoder.encode("\u001B[2K\r"));

    if (i < lineCount - 1) {
      writeAllSync(writer, encoder.encode(`\u001B[1A`));
    }
  }
}
