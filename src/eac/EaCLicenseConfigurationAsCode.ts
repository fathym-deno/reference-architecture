import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCLicenseConfigurationDetails } from "./EaCLicenseConfigurationDetails.ts";
import type { EaCPlanAsCode } from "./EaCPlanAsCode.ts";

export interface EaCLicenseConfigurationAsCode
  extends EaCDetails<EaCLicenseConfigurationDetails> {
  Plans?: { [key: string]: EaCPlanAsCode } | null;
}
