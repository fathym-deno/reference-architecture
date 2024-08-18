import { establishHeaders } from "./establishHeaders.ts";

/**
 * Processes cache control headers on a response.
 *
 * @param resp The response to process.
 * @param cacheControl An optional object with cache control headers. The keys are regular expressions to match content types, and the value is used as the cache control header value.
 * @param forceCache
 * @returns The response with updated cache control headers.
 *
 * @example From direct import
 * ```typescript
 * import { processCacheControlHeaders } from "@fathym/common/http";
 *
 * const resp = processCacheControlHeaders(response, {
 *  'text\\/css': `public, max-age=${60 * 60 * 24 * 365}, immutable`
 * ```
 * });
 *
 * @example From common import
 * ```typescript
 * import { processCacheControlHeaders } from "@fathym/common";
 *
 * const resp = processCacheControlHeaders(response, {
 *  'text\\/css': `public, max-age=${60 * 60 * 24 * 365}, immutable`
 * ```
 * });
 */
export function processCacheControlHeaders(
  resp: Response,
  cacheControl?: Record<string, string>,
  forceCache?: boolean,
): Response {
  if (cacheControl) {
    const cacheControlRegexs = Object.keys(cacheControl);

    if (forceCache || !resp.headers.has("cache-control")) {
      const cacheControlKey = cacheControlRegexs.find((ccr) =>
        new RegExp(ccr, "i").test(resp.headers.get("content-type")!)
      );

      if (cacheControlKey) {
        resp = new Response(resp.body, {
          headers: establishHeaders(resp.headers, {
            "cache-control": cacheControl[cacheControlKey],
          }),
          status: resp.status,
          statusText: resp.statusText,
        });
      }
    }
  }

  return resp;
}
