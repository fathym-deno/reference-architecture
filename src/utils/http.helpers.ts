// deno-lint-ignore-file no-explicit-any
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

export async function proxyRequest(
  req: Request,
  proxyRoot: string,
  base: string,
  path: string,
  search?: string,
  hash?: string,
  redirectMode?: "error" | "follow" | "manual",
  cacheControl?: Record<string, string>,
  forceCache?: boolean,
  // remoteAddr?: string,
): Promise<Response> {
  const originalUrl = new URL(`${base}${path}`);

  originalUrl.hash = hash || "";

  originalUrl.search = search || "";

  const proxyUrl = new URL(`${proxyRoot}${path}`);

  for (const queryParam of originalUrl.searchParams.keys()) {
    const queryValues = originalUrl.searchParams.getAll(queryParam);

    queryValues.forEach((qv, i) => {
      if (i === 0) {
        proxyUrl.searchParams.set(queryParam, qv || "");
      } else {
        proxyUrl.searchParams.append(queryParam, qv || "");
      }
    });
  }

  proxyUrl.hash = originalUrl.hash ?? proxyUrl.hash;

  const headers = establishHeaders(req.headers, {
    // 'x-forwarded-for': remoteAddr,
    "x-forwarded-host": originalUrl.host,
    "x-forwarded-proto": originalUrl.protocol,
    "x-eac-forwarded-host": originalUrl.host,
    "x-eac-forwarded-proto": originalUrl.protocol,
  });

  const proxyReqOptions = ["body", "method", "redirect", "signal"];

  const reqInit: Record<string, unknown> = proxyReqOptions.reduce((ri, key) => {
    ri[key] = (req as any)[key];

    return ri;
  }, {} as Record<string, unknown>);

  const proxyReq = new Request(proxyUrl, {
    ...reqInit,
    headers,
  });

  let resp = await fetch(proxyReq, {
    // method: proxyReq.method,
    redirect: redirectMode || "manual",
    credentials: "include",
  });

  const redirectLocation = resp.headers.get("location");

  if (redirectLocation) {
    resp = redirectRequest(redirectLocation, resp.status, undefined, resp);
  } else if (
    resp.status === STATUS_CODE.SwitchingProtocols &&
    resp.headers.get("upgrade") === "websocket"
  ) {
    const { socket, response } = Deno.upgradeWebSocket(req);

    const wsProxy = new WebSocket(proxyUrl);

    wsProxy.addEventListener("open", (_e) => {});

    wsProxy.addEventListener("close", (_e) => {
      socket.close();
    });

    wsProxy.addEventListener("message", (proxyMsg) => {
      socket.send(proxyMsg.data);
    });

    socket.addEventListener("open", () => {});

    socket.addEventListener("close", (_e) => {
      wsProxy.close();
    });

    socket.addEventListener("message", (clientMsg) => {
      wsProxy.send(clientMsg.data);
    });

    resp = response;
  } else if (cacheControl) {
    resp = processCacheControlHeaders(resp, cacheControl, forceCache);
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

  return respond(null, {
    status: status,
    headers,
  });
}

export function respond(
  body: string | Record<string, unknown> | unknown[] | null,
  init?: ResponseInit,
) {
  if (body && typeof body !== "string") {
    body = JSON.stringify(body);
  }

  return new Response(body, {
    ...{ status: STATUS_CODE.OK },
    ...(init || {}),
  });
}
