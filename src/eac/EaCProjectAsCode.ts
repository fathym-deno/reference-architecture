import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCProjectDetails } from "./EaCProjectDetails.ts";
import type { EaCDataTokenAsCode } from "./EaCDataTokenAsCode.ts";
import type { EaCRelyingPartyAsCode } from "./EaCRelyingPartyAsCode.ts";

export interface EaCProjectAsCode extends EaCDetails<EaCProjectDetails> {
  ApplicationLookups?: string[] | null;
  DataTokens?: { [key: string]: EaCDataTokenAsCode } | null;
  ModifierLookups?: string[] | null;
  PrimaryHost?: string | null;
  RelyingParty?: EaCRelyingPartyAsCode | null;
}
