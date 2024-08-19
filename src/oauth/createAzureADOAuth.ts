import { createAzureADOAuthConfig } from "./createAzureADOAuthConfig.ts";
import { createOAuthHelpers } from "./createOAuthHelpers.ts";
import type { OAuthHelpers } from "./OAuthHelpers.ts";

/**
 * Creates an OAuth helpers object for Azure AD OAuth.
 *
 * @param clientId The client ID of your Azure AD tenant.
 * @param clientSecret The client secret of your Azure AD tenant.
 * @param tenantId The tenant ID of your Azure AD tenant.
 * @param scopes The scopes for the Azure AD OAuth flow.
 * @returns An OAuth helpers object for Azure AD OAuth.
 */
export function createAzureADOAuth(
  clientId: string,
  clientSecret: string,
  tenantId: string,
  scopes: string[],
): OAuthHelpers {
  return createOAuthHelpers(
    createAzureADOAuthConfig(clientId, clientSecret, tenantId, scopes),
  );
}
