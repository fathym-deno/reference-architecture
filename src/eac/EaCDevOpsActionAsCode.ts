import { EaCDetails } from "./EaCDetails.ts";
import { EaCDevOpsActionDetails } from "./EaCDevOpsActionDetails.ts";

export interface EaCDevOpsActionAsCode
  extends EaCDetails<EaCDevOpsActionDetails> {
  ArtifactLookups?: string[] | null;
  DevOpsActionTriggerLookups?: string[] | null;
  SecretLookups?: string[] | null;
}
