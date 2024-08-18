import type { DenoKVOAuth } from "./.deps.ts";

/**
 * Creates an OAuth2 client configuration.
 *
 * @param clientId The client ID of your OAuth2 configruation.
 * @param clientSecret The client secret of your OAuth2 configruation.
 * @param authorizationEndpointUri The authorization endpoint URI of your OAuth2 configruation.
 * @param tokenUri The token endpoint URI of your OAuth2 configruation.
 * @param scope The name of the scopes you want to request.
 * @returns The configured OAuth2 client configuration.
 */
export function creatOAuthConfig(
  clientId: string,
  clientSecret: string,
  authorizationEndpointUri: string,
  tokenUri: string,
  scope: string[],
): DenoKVOAuth.OAuth2ClientConfig {
  const oAuthConfig: DenoKVOAuth.OAuth2ClientConfig = {
    clientId,
    clientSecret,
    authorizationEndpointUri,
    tokenUri,
    defaults: { scope: scope },
  };

  return oAuthConfig;
}
