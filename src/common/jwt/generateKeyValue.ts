import type { JWTConfig } from "./JWTConfig.ts";

/**
 * Generates a JSON Web Key (JWK) for the given JWT config.
 *
 * @param jwtConfig The JWT config.
 * @returns A JSON Web Key (JWK) for the given JWT config.
 */
export async function generateKeyValue(
  jwtConfig: JWTConfig,
): Promise<JsonWebKey> {
  const key = await crypto.subtle.generateKey(
    jwtConfig.Algorithm,
    true,
    jwtConfig.KeyUsages,
  );

  // deno-lint-ignore no-explicit-any
  return await crypto.subtle.exportKey("jwk" as any, key as CryptoKey);
}
