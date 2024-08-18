import type { DenoKVOAuth } from "./.deps.ts";

/**
 * Creates a GitHub OAuth2 client configuration.
 *
 * @param clientId The client ID of your GitHub application.
 * @param clientSecret The client secret of your GitHub application.
 * @param scope The name of the scopes you want to request.
 * @returns The configured OAuth2 client configuration for GitHub.
 */
export function createGitHubOAuthConfig(
  clientId: string,
  clientSecret: string,
  scope: string[],
): DenoKVOAuth.OAuth2ClientConfig {
  const oAuthConfig: DenoKVOAuth.OAuth2ClientConfig = {
    clientId,
    clientSecret,
    authorizationEndpointUri: "https://github.com/login/oauth/authorize",
    tokenUri: "https://github.com/login/oauth/access_token",
    defaults: { scope: scope },
  };

  return oAuthConfig;
}
