/**
 * User OAuth connection object representing the user's OAuth token.
 */
export type UserOAuthConnection = {
  /** The expiration time of the OAuth token. */
  ExpiresAt: number;

  /** The refresh token used to obtain a new OAuth token. */
  RefreshToken: string;

  /** The OAuth token used to authenticate the user. */
  Token: string;

  /** The username of the user. */
  Username: string;
};

/**
 * Checks if the user's OAuth connection is expired.
 *
 * @param conn The user's OAuth connection object.
 * @returns true if the connection is expired, false otherwise.
 */
export function userOAuthConnExpired(
  conn: UserOAuthConnection | null,
): boolean {
  return (
    !conn?.Username || !conn?.Token || new Date() >= new Date(conn.ExpiresAt)
  );
}
