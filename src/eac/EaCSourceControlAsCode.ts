import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCSourceControlDetails } from "./EaCSourceControlDetails.ts";

export interface EaCSourceControlAsCode
  extends EaCDetails<EaCSourceControlDetails> {
  DevOpsActionTriggerLookups?: string[] | null;
  Type?: string | null;
}
