import { DenoKVOAuth } from "../deno.deps.ts";

export type OAuthHelpers = {
  signIn(
    request: Request,
    options?: DenoKVOAuth.SignInOptions,
  ): Promise<Response>;

  handleCallback(request: Request): Promise<{
    response: Response;
    sessionId: string;
    tokens: DenoKVOAuth.Tokens;
  }>;

  signOut(request: Request): Promise<Response>;

  getSessionId(request: Request): Promise<string | undefined>;
};

export function createOAuthHelpers(
  oAuthConfig: DenoKVOAuth.OAuth2ClientConfig,
): OAuthHelpers {
  const helpers = DenoKVOAuth.createHelpers(oAuthConfig);

  return helpers;
}

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

export async function oAuthRequest(
  req: Request,
  oAuthConfig: DenoKVOAuth.OAuth2ClientConfig,
  completeCallback: (
    tokens: DenoKVOAuth.Tokens,
    newSessionId: string,
    oldSessionId?: string,
  ) => Promise<void>,
  root: string,
  path: string,
): Promise<Response> {
  let oAuthPath = path;

  if (oAuthPath.startsWith("/")) {
    oAuthPath = oAuthPath.substring(1);
  }

  const helpers = createOAuthHelpers(oAuthConfig);

  let resp: Response;

  switch (oAuthPath) {
    case "signin": {
      let callbackPath = oAuthPath.replace(oAuthPath, "callback");

      callbackPath = `${root}${callbackPath}`;

      resp = await helpers.signIn(req, {
        urlParams: {
          redirect_uri: callbackPath,
        },
      });

      break;
    }

    case "callback": {
      const oldSessionId = await helpers.getSessionId(req);

      const { response, tokens, sessionId } = await helpers.handleCallback(req);

      completeCallback(tokens, sessionId, oldSessionId);

      resp = response;

      break;
    }

    case "signout": {
      resp = await helpers.signOut(req);

      break;
    }

    default: {
      throw new Error(`The provided path '${oAuthPath}' is invalid.`);
    }
  }

  return resp;
}
