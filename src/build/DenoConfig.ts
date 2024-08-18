/**
 * This is the schema for the Deno configuration file.
 * @module
 *
 * @example From direct import
 * ```typescript
 * import { DenoConfig } from '@fathym/common/build';
 *
 * const denoConfig: DenoConfig = {
 *   name: 'My Deno Project',
 *   version: '1.0.0',
 * };
 * ```
 */
export interface DenoConfig {
  name?: string;
  version?: string;
  imports?: Record<string, string>;
  importMap?: string;
  tasks?: Record<string, string>;
  lint?: {
    rules: { tags?: string[] };
    exclude?: string[];
  };
  fmt?: {
    exclude?: string[];
  };
  exclude?: string[];
  compilerOptions?: {
    jsx?: string;

    jsxFactory?: string;

    jsxFragmentFactory?: string;

    jsxImportSource?: string;
  };
}
