import { STATUS_CODE } from "../src.deps.ts";

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

export function redirectRequest(
  location: string,
  status: number,
  req?: Request,
  resp?: Response,
): Response;

export function redirectRequest(
  location: string,
  preserve: boolean,
  permanent: boolean,
  reqResp?: Request,
  resp?: Response,
): Response;

export function redirectRequest(
  location: string,
  statusPreserve: number | boolean,
  reqPermanent?: Request | boolean,
  respReq?: Response | Request,
  resp?: Response,
): Response {
  let preserve: boolean;
  let permanent: boolean;
  let status: number;
  let req: Request;

  if (typeof statusPreserve === "number") {
    status = statusPreserve;

    req = reqPermanent as Request;

    resp = respReq as Response;
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

  const headers = establishHeaders(resp?.headers || new Headers(), {
    location: location,
  });

  return new Response(null, {
    status: status,
    headers,
  });
}
