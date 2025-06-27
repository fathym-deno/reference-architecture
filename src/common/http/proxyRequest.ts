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
  originalUrl.search = search ?? "";
  originalUrl.hash = hash ?? "";

  const proxyUrl = new URL(`${proxyRoot}${path}`.replace("//", "/"));

  for (const [key, value] of originalUrl.searchParams.entries()) {
    proxyUrl.searchParams.append(key, value);
  }
  proxyUrl.hash = originalUrl.hash;

  let reqHeaders = establishHeaders(req.headers, headers ?? {});
  reqHeaders = establishHeaders(reqHeaders, {
    "x-forwarded-host": originalUrl.host,
    "x-forwarded-proto": originalUrl.protocol,
    "x-eac-forwarded-host": originalUrl.host,
    "x-eac-forwarded-proto": originalUrl.protocol,
    "x-eac-forwarded-path": originalUrl.pathname,
  });

  const proxyReqInit: Record<string, unknown> = [
    "body",
    "method",
    "redirect",
    "signal",
  ].reduce(
    (ri, key) => {
      ri[key] = (req as any)[key];
      return ri;
    },
    {} as Record<string, unknown>,
  );

  const proxyReq = new Request(proxyUrl, {
    ...proxyReqInit,
    headers: reqHeaders,
  });

  let resp = await fetch(proxyReq, {
    redirect: redirectMode ?? "manual",
    credentials: "include",
  });

  const redirectLocation = resp.headers.get("location");

  if (redirectLocation) {
    return redirectRequest(
      redirectLocation,
      resp.status,
      undefined,
      resp.headers,
    );
  }

  // 🔁 WebSocket Proxying
  if (
    resp.status === STATUS_CODE.SwitchingProtocols &&
    resp.headers.get("upgrade") === "websocket"
  ) {
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);
    const proxySocket = new WebSocket(proxyUrl);

    let proxySocketOpen = false;
    const pendingMessages: string[] = [];

    proxySocket.addEventListener("open", () => {
      proxySocketOpen = true;
      for (const msg of pendingMessages) {
        proxySocket.send(msg);
      }
      pendingMessages.length = 0;
    });

    proxySocket.addEventListener("message", (proxyMsg) => {
      try {
        clientSocket.send(proxyMsg.data);
      } catch (err) {
        console.error(
          "[proxyRequest] ⚠️ Failed to forward proxy → client:",
          err,
        );
      }
    });

    proxySocket.addEventListener("close", () => {
      clientSocket.close();
    });

    proxySocket.addEventListener("error", (err) => {
      console.error("[proxyRequest] ❌ Proxy socket error:", err);
      clientSocket.close();
    });

    clientSocket.addEventListener("message", (clientMsg) => {
      if (proxySocketOpen) {
        proxySocket.send(clientMsg.data);
      } else {
        pendingMessages.push(clientMsg.data);
      }
    });

    clientSocket.addEventListener("close", () => {
      proxySocket.close();
    });

    clientSocket.addEventListener("error", (err) => {
      console.error("[proxyRequest] ❌ Client socket error:", err);
      proxySocket.close();
    });

    return response;
  }

  // 🔒 Static caching (if enabled)
  if (cacheControl) {
    resp = processCacheControlHeaders(resp, cacheControl, forceCache);
  }

  return resp;
}
