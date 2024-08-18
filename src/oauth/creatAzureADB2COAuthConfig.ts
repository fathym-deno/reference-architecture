import type { DenoKVOAuth } from "./.deps.ts";

/**
 * Creates an Azure AD B2C OAuth2 client configuration.
 *
 * @param clientId The client ID of your Azure AD B2C tenant.
 * @param clientSecret The client secret of your Azure AD B2C tenant.
 * @param domain The domain of your Azure AD B2C tenant.
 * @param policyName The name of the policy.
 * @param tenantId The tenant ID of your Azure AD B2C tenant.
 * @param scope The name of the scopes you want to request.
 * @returns The configured OAuth2 client configuration for Azure AD B2C.
 */
export function creatAzureADB2COAuthConfig(
  clientId: string,
  clientSecret: string,
  domain: string,
  policyName: string,
  tenantId: string,
  scope: string[],
): DenoKVOAuth.OAuth2ClientConfig {
  const authEndpointUri =
    `https://${domain}/${tenantId}/${policyName}/oauth2/v2.0/authorize`;

  const tokenUri =
    `https://${domain}/${tenantId}/${policyName}/oauth2/v2.0/token`;

  const oAuthConfig: DenoKVOAuth.OAuth2ClientConfig = {
    clientId,
    clientSecret,
    authorizationEndpointUri: authEndpointUri,
    tokenUri,
    defaults: { scope: scope },
  };

  return oAuthConfig;
}
