import { EaCVertexDetails } from "./EaCVertexDetails.ts";

export interface EaCSecretDetails extends EaCVertexDetails {
  DataTokenLookup?: string | null;
  KnownAs?: string | null;
}