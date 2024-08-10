import type { EaCProviderDetails } from "./EaCProviderDetails.ts";
import type { EaCDetails } from "./EaCDetails.ts";

export interface EaCProviderAsCode extends EaCDetails<EaCProviderDetails> {
  Type?: string | null;
}
