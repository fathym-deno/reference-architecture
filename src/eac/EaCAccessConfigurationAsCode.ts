import { EaCDetails } from "./EaCDetails.ts";
import { EaCAccessConfigurationDetails } from "./EaCAccessConfigurationDetails.ts";

export interface EaCAccessConfigurationAsCode extends EaCDetails<EaCAccessConfigurationDetails> {
  AccessRightLookups?: string[] | null;
  ProviderLookups?: string[] | null;
  Usernames?: string[] | null;
}