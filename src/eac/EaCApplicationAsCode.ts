import { EaCDetails } from "./EaCDetails.ts";
import { EaCDataTokenAsCode } from "./EaCDataTokenAsCode.ts";
import { EaCApplicationLookupConfiguration } from "./EaCApplicationLookupConfiguration.ts";
import { EaCPackage } from "./EaCPackage.ts";
import { EaCProcessor } from "./EaCProcessor.ts";
import { EaCApplicationDetails } from "./EaCApplicationDetails.ts";

export interface EaCApplicationAsCode
  extends EaCDetails<EaCApplicationDetails> {
  AccessRightLookups?: string[] | null;
  DataTokens?: { [key: string]: EaCDataTokenAsCode } | null;
  LicenseConfigurationLookups?: string[] | null;
  LookupConfig?: EaCApplicationLookupConfiguration | null;
  ModifierLookups?: string[] | null;
  Package?: EaCPackage | null;
  Processor?: EaCProcessor | null;
}
