import type { DenoKVOAuth } from "./.deps.ts";

/**
 * Creates an Azure AD OAuth2 client configuration.
 *
 * @param clientId The client ID of your Azure AD tenant.
 * @param clientSecret The client secret of your Azure AD tenant.
 * @param tenantId The tenant ID of your Azure AD tenant.
 * @param scope The name of the scopes you want to request.
 * @returns The configured OAuth2 client configuration for Azure AD.
 */
export function createAzureADOAuthConfig(
  clientId: string,
  clientSecret: string,
  tenantId: string,
  scope: string[],
): DenoKVOAuth.OAuth2ClientConfig {
  const baseUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0`;

  const oAuthConfig: DenoKVOAuth.OAuth2ClientConfig = {
    clientId,
    clientSecret,
    authorizationEndpointUri: `${baseUrl}/authorize`,
    tokenUri: `${baseUrl}/token`,
    defaults: {
      scope: scope,
    },
  };

  return oAuthConfig;
}
