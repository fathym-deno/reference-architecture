/**
 * Helpers for working with Deno and build processes.
 * @module
 *
 * @example DenoConfig from direct import
 * ```typescript
 * import { DenoConfig } from '@fathym/common/build';
 *
 * const denoConfig: DenoConfig = {
 *   name: 'My Deno Project',
 *   version: '1.0.0',
 * };
 * ```
 *
 * @example Load Deno Config from direct import
 * ```typescript
 * import { loadDenoConfig } from '@fathym/common/build';
 *
 * const { Config, DenoConfigPath } = await loadDenoConfig();
 * ```
 *
 * @example Load RefArch meta URL from direct import
 * ```typescript
 * import { loadRefArchMetaUrl } from '@fathym/common/build';
 *
 * const metaUrl = loadRefArchMetaUrl('./src/common/.exports.ts');
 * ```
 *
 * @example From direct import
 * ```typescript
 * import { resolvePath } from '@fathym/common/build';
 *
 * const path = resolvePath('./src/common/.exports.ts', import.meta.resolve);
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
 *
 * @example Version Deno task script
 * ```command prompt
 * deno run -A jsr:@fathym/common/build/version -- 0.0.0
 * ```
 */
export * from './DenoConfig.ts';
export * from './loadDenoConfig.ts';
export * from './resolvePath.ts';
export * from './loadRefArchMetaUrl.ts';
export * from './SetVersion.ts';
