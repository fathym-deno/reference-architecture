import { encodeBase64 } from "./.deps.ts";
import { generateKeyValue } from "./generateKeyValue.ts";

export async function logNewJWK() {
  const jwk = await generateKeyValue({
    Algorithm: { name: "HMAC", hash: "SHA-512" } as AlgorithmIdentifier,
    KeyUsages: ["sign", "verify"] as KeyUsage[],
    // deno-lint-ignore no-explicit-any
  } as any);

  console.log(encodeBase64(new TextEncoder().encode(JSON.stringify(jwk))));
}
