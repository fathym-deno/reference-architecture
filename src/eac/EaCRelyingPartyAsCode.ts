import { EaCDetails } from "./EaCDetails.ts";
import { EaCRelyingPartyDetails } from "./EaCRelyingPartyDetails.ts";
import { EaCAccessConfigurationAsCode } from "./EaCAccessConfigurationAsCode.ts";

export interface EaCRelyingPartyAsCode
  extends EaCDetails<EaCRelyingPartyDetails> {
  AccessRightLookups?: string[] | null;
  DefaultAccessConfigurationLookup?: string | null;
  AccessConfigurations?: { [key: string]: EaCAccessConfigurationAsCode } | null;
  TrustedProviderLookups?: string[] | null;
}
