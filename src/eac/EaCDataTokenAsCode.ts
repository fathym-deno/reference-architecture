import { EaCDetails } from "./EaCDetails.ts";
import { EaCDataTokenDetails } from "./EaCDataTokenDetails.ts";

export interface EaCDataTokenAsCode extends EaCDetails<EaCDataTokenDetails> {
  Value?: string | null;
}
