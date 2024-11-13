export type URLMatch = {
  Base: string;

  FromBase: (path: string | URL) => URL;

  FromOrigin: (path: string | URL) => URL;

  Hash?: string;

  Path: string;

  Search?: string;

  SearchParams?: URLSearchParams;

  ToRoot: (root: string | URL) => URL;

  URL: URL;
};
