/**
 * This is the schema for the Deno configuration file.
 * @module
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
