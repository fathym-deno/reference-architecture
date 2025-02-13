// deno-lint-ignore-file no-explicit-any
import { STATUS_CODE } from "./.deps.ts";
import { establishHeaders } from "./establishHeaders.ts";
import { processCacheControlHeaders } from "./processCacheControlHeaders.ts";
import { redirectRequest } from "./redirectRequest.ts";

/**
 * Proxies the request to a remote server.
 *
 * @param req The request to be proxied.
 * @param proxyRoot The root of the server to be proxied to.
 * @param base The base URL of the request.
 * @param path The path to be appended to the proxy root.
 * @param headers The additional headers to be sent with the request.
 * @param search The search parameters to be appended to the proxy root.
 * @param hash The hash to be appended to the proxy root.
 * @param redirectMode The redirect mode to be used.
 * @param cacheControl The cache control headers to be sent with the request.
 * @param forceCache When true, forces the request to use the cache control headers. When false, respects the cache control headers of the proxied response if set, if not set it uses the cache control headers.
 * @returns The proxied response.
 *
 * @example From direct import
 * ```typescript
 * import { proxyRequest } from '@fathym/common/http';
 *
 * const resp = await proxyRequest(req, 'https://api.example.com', 'https://localhost:8080', '/api',
 *    { 'Authorization': 'Bearer token' });
 * ```
 *
 * @example From common import
 * ```typescript
 * import { proxyRequest } from '@fathym/common';
 *
 * const resp = await proxyRequest(req, 'https://api.example.com', 'https://localhost:8080', '/api',
 *    { 'Authorization': 'Bearer token' });
 * ```
 */
export async function proxyRequest(
  req: Request,
  proxyRoot: string,
  base: string,
  path: string,
  headers?: Record<string, string>,
  search?: string,
  hash?: string,
  redirectMode?: "error" | "follow" | "manual",
  cacheControl?: Record<string, string>,
  forceCache?: boolean,
): Promise<Response> {
  const originalUrl = new URL(path, base);

  originalUrl.hash = hash || "";

  originalUrl.search = search || "";

  const proxyUrl = new URL(`${proxyRoot}${path}`.replace("//", "/"));

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

  let reqHeaders = establishHeaders(req.headers, headers || {});

  reqHeaders = establishHeaders(reqHeaders, {
    // 'x-forwarded-for': remoteAddr,
    "x-forwarded-host": originalUrl.host,
    "x-forwarded-proto": originalUrl.protocol,
    "x-eac-forwarded-host": originalUrl.host,
    "x-eac-forwarded-proto": originalUrl.protocol,
    "x-eac-forwarded-path": originalUrl.pathname,
  });

  const proxyReqOptions = ["body", "method", "redirect", "signal"];

  const reqInit: Record<string, unknown> = proxyReqOptions.reduce((ri, key) => {
    ri[key] = (req as any)[key];

    return ri;
  }, {} as Record<string, unknown>);

  const proxyReq = new Request(proxyUrl, {
    ...reqInit,
    headers: reqHeaders,
  });

  let resp = await fetch(proxyReq, {
    // method: proxyReq.method,
    redirect: redirectMode || "manual",
    credentials: "include",
  });

  const redirectLocation = resp.headers.get("location");

  if (redirectLocation) {
    resp = redirectRequest(
      redirectLocation,
      resp.status,
      undefined,
      resp.headers,
    );
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
