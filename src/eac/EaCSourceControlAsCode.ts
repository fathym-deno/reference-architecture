import { EaCDetails } from "./EaCDetails.ts";
import { EaCSourceControlDetails } from "./EaCSourceControlDetails.ts";

export interface EaCSourceControlAsCode
  extends EaCDetails<EaCSourceControlDetails> {
  DevOpsActionTriggerLookups?: string[] | null;
  Type?: string | null;
}
