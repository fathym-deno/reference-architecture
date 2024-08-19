import { createGitHubOAuthConfig } from "./createGitHubOAuthConfig.ts";
import { createOAuthHelpers } from "./createOAuthHelpers.ts";
import type { OAuthHelpers } from "./OAuthHelpers.ts";

/**
 * Creates an OAuth helpers object for GitHub OAuth.
 *
 * @param scopes The scopes for the GitHub OAuth flow.
 * @returns An OAuth helpers object for GitHub OAuth.
 */
export function createGitHubOAuth(
  clientId: string,
  clientSecret: string,
  scopes: string[],
): OAuthHelpers {
  return createOAuthHelpers(
    createGitHubOAuthConfig(clientId, clientSecret, scopes),
  );
}
