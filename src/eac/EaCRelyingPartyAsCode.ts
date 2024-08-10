import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCRelyingPartyDetails } from "./EaCRelyingPartyDetails.ts";
import type { EaCAccessConfigurationAsCode } from "./EaCAccessConfigurationAsCode.ts";

export interface EaCRelyingPartyAsCode
  extends EaCDetails<EaCRelyingPartyDetails> {
  AccessRightLookups?: string[] | null;
  DefaultAccessConfigurationLookup?: string | null;
  AccessConfigurations?: { [key: string]: EaCAccessConfigurationAsCode } | null;
  TrustedProviderLookups?: string[] | null;
}
