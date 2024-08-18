import { STATUS_CODE } from "./.deps.ts";
import { establishHeaders } from "./establishHeaders.ts";

/**
 * Redirects the request to a new location with the specified status code.
 *
 * @param location The location to redirect to.
 * @param status The HTTP status code to use for the redirect.
 * @param req The base request for relative redirect.
 * @param respHeaders The additional response headers for the redirect.
 * @returns The redirected response.
 *
 * @example From direct import
 * import { redirectRequest } from "@fathym/common/http";
 *
 * const resp = redirectRequest("/new-location", 301);
 *
 * @example From common import
 * import { redirectRequest } from "@fathym/common";
 *
 * const resp = redirectRequest("/new-location", 301);
 */
export function redirectRequest(
  location: string,
  status: number,
  req?: Request,
  respHeaders?: Headers,
): Response;

/**
 * Redirects the request to a new location with flags for permanent and preserve.
 *
 * @param location The location to redirect to.
 * @param preserve Whether to preserve the original request headers.
 * @param permanent Whether the redirect should be permanent.
 * @param reqResp The base request for relative redirect.
 * @param respHeaders The additional response headers for the redirect.
 * @returns The redirected response.
 *
 * @example From direct import
 * import { redirectRequest } from "@fathym/common/http";
 *
 * const resp = redirectRequest("/new-location", false, true);
 *
 * @example From common import
 * import { redirectRequest } from "@fathym/common";
 *
 * const resp = redirectRequest("/new-location", false, true);
 */
export function redirectRequest(
  location: string,
  preserve: boolean,
  permanent: boolean,
  reqResp?: Request,
  respHeaders?: Headers,
): Response;

/**
 * Redirects the request to a new location.
 *
 * @param location The location to redirect to.
 * @param statusPreserve Whether to preserve the original request headers or the status code.
 * @param reqPermanent Whether the redirect should be permanent or the base request.
 * @param respReq The default response headers or the base request.
 * @param respHeaders THe default response headers.
 * @returns The redirected response.
 *
 * @example From direct import
 * import { redirectRequest } from "@fathym/common/http";
 *
 * const resp = redirectRequest("/new-location", 301);
 *
 * @example From common import
 * import { redirectRequest } from "@fathym/common";
 *
 * const resp = redirectRequest("/new-location", false, true);
 */
export function redirectRequest(
  location: string,
  statusPreserve: number | boolean,
  reqPermanent?: Request | boolean,
  respReq?: Headers | Request,
  respHeaders?: Headers,
): Response {
  let preserve: boolean;
  let permanent: boolean;
  let status: number;
  let req: Request;

  if (typeof statusPreserve === "number") {
    status = statusPreserve;

    req = reqPermanent as Request;

    respHeaders = respReq as Headers;
  } else {
    preserve = statusPreserve;

    permanent = reqPermanent as boolean;

    req = respReq as Request;

    if (preserve) {
      status = permanent
        ? STATUS_CODE.PermanentRedirect
        : STATUS_CODE.TemporaryRedirect;
    } else {
      status = permanent ? STATUS_CODE.MovedPermanently : STATUS_CODE.Found;
    }
  }

  if (req) {
    // TODO(mcgear): Add basePattern to call, and if req provided, run basePattern and append to the location
  }

  const headers = establishHeaders(respHeaders || new Headers(), {
    location: location,
  });

  return new Response(null, {
    status: status,
    headers,
  });
}
