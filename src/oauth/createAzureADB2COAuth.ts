import { creatAzureADB2COAuthConfig } from "./creatAzureADB2COAuthConfig.ts";
import { createOAuthHelpers } from "./createOAuthHelpers.ts";
import type { OAuthHelpers } from "./OAuthHelpers.ts";

/**
 * Creates an OAuth helpers object for Azure AD OAuth.
 *
 * @param clientId The client ID of your Azure AD tenant.
 * @param clientSecret The client secret of your Azure AD tenant.
 * @param domain The domain of your Azure AD B2C tenant.
 * @param policyName The name of the policy.
 * @param tenantId The tenant ID of your Azure AD B2C tenant.
 * @param scopes The scopes for the Azure AD OAuth flow.
 * @returns An OAuth helpers object for Azure AD B2C OAuth.
 */
export function createAzureADB2COAuth(
  clientId: string,
  clientSecret: string,
  domain: string,
  policyName: string,
  tenantId: string,
  scopes: string[],
): OAuthHelpers {
  return createOAuthHelpers(
    creatAzureADB2COAuthConfig(
      clientId,
      clientSecret,
      domain,
      policyName,
      tenantId,
      scopes,
    ),
  );
}
