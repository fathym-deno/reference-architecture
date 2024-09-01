import type { WriterSync } from "jsr:@std/io@0.224.6/types";
import { writeAllSync } from "jsr:@std/io@0.224.6/write-all";

/**
 * Shows the terminal cursor
 */
export function showCursor(writer: WriterSync, encoder: TextEncoder): void {
  writeAllSync(writer, encoder.encode("\u001B[?25h"));
}
