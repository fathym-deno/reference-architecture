export * as Colors from 'jsr:@std/fmt@1.0.1/colors';
export { parse as parseJsonc } from 'jsr:@std/jsonc@1.0.0';
export {
  ConsoleHandler,
  getLogger,
  type LogConfig,
  Logger,
  type LogRecord,
  setup,
} from 'jsr:@std/log@0.224.6';
export { join as pathJoin } from 'jsr:@std/path@^1.0.2';

export { jsonMapSetStringify } from 'jsr:@fathym/common@0.2.34/iterables/json-map-set';

// import Kia, { type Color } from '../../../../kia/mod.ts';
// import Kia, { type Color } from 'jsr:@fathym/kia@0.0.117';
// export { type Color, Kia };

export { type DenoConfig } from '../../build/DenoConfig.ts';

// import chalk from 'npm:chalk@5.3.0';
// export { chalk };

// import ora, { type Color, type Ora } from 'npm:ora@8.1.0';
// export { Color as OraColor, ora, Ora };
