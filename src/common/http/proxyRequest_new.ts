// // deno-lint-ignore-file no-explicit-any
// import type { STATUS_CODE } from "./.deps.ts";
// import { establishHeaders } from "./establishHeaders.ts";
// import type { processCacheControlHeaders } from "./processCacheControlHeaders.ts";
// import type { redirectRequest } from "./redirectRequest.ts";

// /**
//  * Proxies the request to a remote server.
//  *
//  * @param req The request to be proxied.
//  * @param proxyRoot The root of the server to be proxied to.
//  * @param base The base URL of the request.
//  * @param path The path to be appended to the proxy root.
//  * @param headers The additional headers to be sent with the request.
//  * @param search The search parameters to be appended to the proxy root.
//  * @param hash The hash to be appended to the proxy root.
//  * @param redirectMode The redirect mode to be used.
//  * @param cacheControl The cache control headers to be sent with the request.
//  * @param forceCache When true, forces the request to use the cache control headers. When false, respects the cache control headers of the proxied response if set, if not set it uses the cache control headers.
//  * @returns The proxied response.
//  */
// export async function proxyRequest(
//   req: Request,
//   proxyRoot: string,
//   base: string,
//   path: string,
//   headers?: Record<string, string>,
//   search?: string,
//   hash?: string,
//   redirectMode?: "error" | "follow" | "manual",
//   cacheControl?: Record<string, string>,
//   forceCache?: boolean,
// ): Promise<Response> {
//   // Construct URLs
//   const originalUrl = new URL(`${base}${path}`);
//   const proxyUrl = new URL(`${proxyRoot}${path}`);
//   originalUrl.hash = hash || "";
//   originalUrl.search = search || "";

//   // Forward query parameters from the original request to the proxy URL
//   for (const queryParam of originalUrl.searchParams.keys()) {
//     const queryValues = originalUrl.searchParams.getAll(queryParam);
//     queryValues.forEach((qv, i) => {
//       if (i === 0) {
//         proxyUrl.searchParams.set(queryParam, qv || "");
//       } else {
//         proxyUrl.searchParams.append(queryParam, qv || "");
//       }
//     });
//   }
//   proxyUrl.hash = originalUrl.hash ?? proxyUrl.hash;

//   // Establish request headers with forwarding information
//   let reqHeaders = establishHeaders(req.headers, headers || {});
//   reqHeaders = establishHeaders(reqHeaders, {
//     "x-forwarded-host": originalUrl.host,
//     "x-forwarded-proto": originalUrl.protocol,
//     "x-eac-forwarded-host": originalUrl.host,
//     "x-eac-forwarded-proto": originalUrl.protocol,
//     "x-eac-forwarded-path": originalUrl.pathname,
//   });

//   // Handle WebSocket upgrade requests
//   if (
//     req.headers.get("upgrade")?.toLowerCase() === "websocket" &&
//     req.headers.get("connection")?.toLowerCase().includes("upgrade")
//   ) {
//     const { socket, response } = Deno.upgradeWebSocket(req); // Upgrade to WebSocket for client

//     const wsProtocol = proxyUrl.protocol === "https:" ? "wss://" : "ws://";
//     const wsProxy = new WebSocket(
//       wsProtocol + proxyUrl.host + proxyUrl.pathname + proxyUrl.search,
//     );

//     // WebSocket Event Handlers
//     wsProxy.addEventListener(
//       "open",
//       () => console.log("Proxy WebSocket connection opened"),
//     );
//     wsProxy.addEventListener(
//       "message",
//       (proxyMsg) => socket.send(proxyMsg.data),
//     );
//     wsProxy.addEventListener("close", () => {
//       socket.close();
//       console.log("Proxy WebSocket connection closed");
//     });
//     wsProxy.addEventListener("error", (e) => {
//       console.error("Proxy WebSocket error:", e);
//       socket.close();
//     });

//     // Client WebSocket Event Handlers
//     socket.addEventListener(
//       "message",
//       (clientMsg) => wsProxy.send(clientMsg.data),
//     );
//     socket.addEventListener("close", () => wsProxy.close());

//     return response; // Return WebSocket response directly
//   } else {
//     throw new Error("Invalid WebSocket upgrade headers");
//   }

//   // Handle HTTP requests normally
//   // const proxyReqOptions = ["body", "method", "redirect", "signal"];
//   // const reqInit: Record<string, unknown> = proxyReqOptions.reduce((ri, key) => {
//   //   ri[key] = (req as any)[key];
//   //   return ri;
//   // }, {} as Record<string, unknown>);

//   // const proxyReq = new Request(proxyUrl, {
//   //   ...reqInit,
//   //   headers: reqHeaders,
//   // });

//   // let resp = await fetch(proxyReq, {
//   //   redirect: redirectMode || "manual",
//   //   credentials: "include",
//   // });

//   // // Handle HTTP redirects if applicable
//   // const redirectLocation = resp.headers.get("location");
//   // if (redirectLocation) {
//   //   resp = redirectRequest(redirectLocation, resp.status, undefined, resp.headers);
//   // } else if (cacheControl) {
//   //   resp = processCacheControlHeaders(resp, cacheControl, forceCache);
//   // }

//   // return resp;
// }
