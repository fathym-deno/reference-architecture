import { EaCDetails } from "./EaCDetails.ts";
import { EaCLicenseConfigurationDetails } from "./EaCLicenseConfigurationDetails.ts";
import { EaCPlanAsCode } from "./EaCPlanAsCode.ts";

export interface EaCLicenseConfigurationAsCode extends EaCDetails<EaCLicenseConfigurationDetails> {
  Plans?: { [key: string]: EaCPlanAsCode } | null;
}