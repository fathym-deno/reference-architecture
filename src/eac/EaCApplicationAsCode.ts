import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCDataTokenAsCode } from "./EaCDataTokenAsCode.ts";
import type { EaCApplicationLookupConfiguration } from "./EaCApplicationLookupConfiguration.ts";
import type { EaCPackage } from "./EaCPackage.ts";
import type { EaCProcessor } from "./EaCProcessor.ts";
import type { EaCApplicationDetails } from "./EaCApplicationDetails.ts";

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
