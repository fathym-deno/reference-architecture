import { DenoKVOAuth } from "./.deps.ts";
import type { OAuthHelpers } from "./OAuthHelpers.ts";

/**
 * Creates an OAuth helpers object.
 *
 * @param oAuthConfig The OAuth2 client configuration.
 * @returns An object containing OAuth2 helper functions.
 */
export function createOAuthHelpers(
  oAuthConfig: DenoKVOAuth.OAuth2ClientConfig,
): OAuthHelpers {
  const helpers = DenoKVOAuth.createHelpers(oAuthConfig);

  return helpers;
}
