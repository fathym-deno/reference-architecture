import { computeBaseHref } from "./computeBaseHref.ts";
import type { URLMatch } from "./URLMatch.ts";

export function buildURLMatch(pattern: URLPattern, req: Request): URLMatch {
  const reqUrl = new URL(req.url);

  const forwardedProto = req.headers.get("x-eac-forwarded-proto") ??
    req.headers.get("x-forwarded-proto") ??
    reqUrl.protocol;

  const host = req.headers.get("x-eac-forwarded-host") ??
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    reqUrl.host;

  const reqCheckUrl = new URL(
    reqUrl.href.replace(reqUrl.origin, ""),
    `${forwardedProto}://${host}`.replace("::", ":"),
  );

  const patternResult = pattern.exec(reqCheckUrl.href);

  const path = patternResult!.pathname.groups[0] || "";

  const base = computeBaseHref(
    req,
    new URL(
      reqCheckUrl.pathname.slice(0, path.length > 0 ? -path.length : undefined),
      reqCheckUrl.origin,
    ).href,
    path,
  );

  const resolvedUrl = new URL(reqCheckUrl.href);
  resolvedUrl.hash = reqUrl.hash;
  resolvedUrl.search = reqUrl.search;

  const urlMatch = {
    Base: base,
    Hash: reqUrl.hash,
    Path: path,
    Search: reqUrl.search,
    SearchParams: reqUrl.searchParams,
    URL: resolvedUrl,
    FromBase: (path: string | URL) => {
      return new URL(path, base.endsWith("/") ? base : `${base}/`);
    },
    FromOrigin: (path: string | URL) => {
      const origin = new URL(base).origin;

      return new URL(path, origin.endsWith("/") ? origin : `${origin}/`);
    },
    ToRoot: (root: string | URL) => {
      return new URL(
        {
          pathname: path,
          search: reqUrl.search,
          hash: reqUrl.hash,
        } as URL,
        typeof root === "string"
          ? root.endsWith("/") ? root : `${root}/`
          : root,
      );
    },
  };

  return urlMatch;
}
