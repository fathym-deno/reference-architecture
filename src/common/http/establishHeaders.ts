/**
 * Establishes headers for an HTTP request, combining existing headers with new.
 *
 * @param headers The existing headers to be combined.
 * @param headersInit The new headers to be added.
 * @returns A new Headers object with the combined headers.
 *
 * @example From direct import
 * import { establishHeaders } from "@fathym/common/http";
 *
 * const headers = establishHeaders(req.headers, { 'Content-Type': 'application/json' });
 *
 * @example From common import
 * import { establishHeaders } from "@fathym/common";
 *
 * const headers = establishHeaders(req.headers, { 'Content-Type': 'application/json' });
 */
export function establishHeaders(
  headers: Headers,
  headersInit: Record<string, string>,
): Headers {
  const newHeaders = new Headers();

  for (const hdr of headers.keys()) {
    newHeaders.set(hdr, headers.get(hdr)!);
  }

  Object.keys(headersInit).forEach((hdr) => {
    newHeaders.set(hdr, headersInit[hdr]);
  });

  return newHeaders;
}
