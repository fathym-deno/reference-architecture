import { EaCDetails } from "./EaCDetails.ts";
import { EaCProjectDetails } from "./EaCProjectDetails.ts";
import { EaCDataTokenAsCode } from "./EaCDataTokenAsCode.ts";
import { EaCRelyingPartyAsCode } from "./EaCRelyingPartyAsCode.ts";

export interface EaCProjectAsCode extends EaCDetails<EaCProjectDetails> {
  ApplicationLookups?: string[] | null;
  DataTokens?: { [key: string]: EaCDataTokenAsCode } | null;
  ModifierLookups?: string[] | null;
  PrimaryHost?: string | null;
  RelyingParty?: EaCRelyingPartyAsCode | null;
}
