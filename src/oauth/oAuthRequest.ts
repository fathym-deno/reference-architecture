import { type DenoKVOAuth, redirectRequest } from "./.deps.ts";
import { createOAuthHelpers } from "./createOAuthHelpers.ts";

/**
 * The OAuth request handler.
 *
 * @param req The request to handle.
 * @param oAuthConfig The OAuth2 client configuration.
 * @param completeCallback The callback to be called when the request is complete.
 * @param root The root URL of the application.
 * @param path The path of the OAuth request.
 * @returns The Oauth response to the request.
 */
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
      try {
        const oldSessionId = await helpers.getSessionId(req);

        const { response, tokens, sessionId } = await helpers.handleCallback(
          req,
        );

        await completeCallback(tokens, sessionId, oldSessionId);

        resp = response;

        resp.headers.set("OAUTH_SESSION_ID", sessionId);
      } catch {
        const signInPath = oAuthPath.replace(oAuthPath, "signin");

        resp = redirectRequest(`${root}${signInPath}`, false, false);
      }

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
