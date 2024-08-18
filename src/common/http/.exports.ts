/**
 * Helpers to assist with HTTP operations.
 * @module
 * 
 * @example Establish headers from direct import
 * ```typescript
 * import { establishHeaders } from "@fathym/common/http";
 *
 * const headers = establishHeaders(req.headers, { 'Content-Type': 'application/json' });
 * ```
 * 
 * @example Process cach control headers from direct import
 * ```typescript
 * import { processCacheControlHeaders } from "@fathym/common/http";
 *
 * const resp = processCacheControlHeaders(response, {
 *  'text\\/css': `public, max-age=${60 * 60 * 24 * 365}, immutable`
 * });
 * ```
 *
 * @example Proxy request from direct import
 * ```typescript
 * import { proxyRequest } from '@fathym/common/http';
 *
 * const resp = await proxyRequest(req, 'https://api.example.com', 'https://localhost:8080', '/api',
 *    { 'Authorization': 'Bearer token' });
 * ```
 *
 * @example Redirect request from direct import
 * ```typescript
 * import { redirectRequest } from "@fathym/common/http";
 *
 * const resp = redirectRequest("/new-location", false, true);
 * ```
 */

export * from './establishHeaders.ts'
export * from './processCacheControlHeaders.ts'
export * from './proxyRequest.ts'
export * from './redirectRequest.ts'