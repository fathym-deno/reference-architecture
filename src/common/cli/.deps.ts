export { parseArgs } from 'jsr:@std/cli@1.0.17/parse-args';
export * as Colors from 'jsr:@std/fmt@1.0.8/colors';
export { walk } from 'jsr:@std/fs@1.0.17';
export { toText } from 'jsr:@std/streams@1.0.9';
export { dirname, resolve, relative, toFileUrl } from 'jsr:@std/path@1.0.9';
export {
  writeAll,
  writeAllSync,
  type Writer,
  type WriterSync,
} from 'jsr:@std/io@0.225.2';

export { merge } from '../merge/.exports.ts';
