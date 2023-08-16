import { EaCDetails } from "./EaCDetails.ts";
import { EaCProcessorDetails } from "./EaCProcessorDetails.ts";

export interface EaCProcessor extends EaCDetails<EaCProcessorDetails> {
  ModifierLookups?: string[] | null;
  Type?: string | null;
}
