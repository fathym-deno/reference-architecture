/**
 * Helpers for working with Deno and build processes.
 * @module
 *
 * @example Load Deno Config from direct import
 * ```typescript
 * import { loadDenoConfig } from '@fathym/common/build';
 *
 * const { Config, DenoConfigPath } = await loadDenoConfig();
 * ```
 *
 * @example From direct import
 * ```typescript
 * import { SetVersion } from '@fathym/common/build';
 *
 * const setVersion = new SetVersion();
 *
 * await setVersion.Configure();
 * ```
 */
export * from './DenoConfig.ts';
export * from './loadDenoConfig.ts';
export * from './SetVersion.ts';
