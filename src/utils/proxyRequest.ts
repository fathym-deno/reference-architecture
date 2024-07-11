// deno-lint-ignore-file no-explicit-any
import { STATUS_CODE } from "../src.deps.ts";
import {
  establishHeaders,
  processCacheControlHeaders,
  redirectRequest,
} from "./http.helpers.ts";

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
