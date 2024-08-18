import type { DenoKVOAuth } from "./.deps.ts";

/**
 * The OAuth helpers interface.
 */
export type OAuthHelpers = {
  /**
   * Signs in the user using the OAuth2 flow.
   */
  signIn(
    request: Request,
    options?: DenoKVOAuth.SignInOptions,
  ): Promise<Response>;

  /**
   * Handles the OAuth2 callback and returns the response, session ID, and tokens.
   *
   * @param request The request to sign in.
   */
  handleCallback(request: Request): Promise<{
    response: Response;
    sessionId: string;
    tokens: DenoKVOAuth.Tokens;
  }>;

  /**
   * Signs out the user.
   *
   * @param request The request to sign out.
   */
  signOut(request: Request): Promise<Response>;

  /**
   * Retrieves the session ID from the request.
   *
   * @param request The request to get the session ID from.
   */
  getSessionId(request: Request): Promise<string | undefined>;
};
