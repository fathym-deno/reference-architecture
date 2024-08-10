import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCDataTokenDetails } from "./EaCDataTokenDetails.ts";

export interface EaCDataTokenAsCode extends EaCDetails<EaCDataTokenDetails> {
  Value?: string | null;
}
