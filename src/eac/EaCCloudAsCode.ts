import { EaCCloudDetails } from "./EaCCloudDetails.ts";
import { EaCDetails } from "./EaCDetails.ts";
import { EaCLandingZoneAsCode } from "./EaCLandingZoneAsCode.ts";
import { EaCCloudResourceGroupAsCode } from "./EaCCloudResourceGroupAsCode.ts";

export interface EaCCloudAsCode extends EaCDetails<EaCCloudDetails> {
  LandingZones?: Record<string, EaCLandingZoneAsCode>;
  ResourceGroups?: Record<string, EaCCloudResourceGroupAsCode>;
  Type?: string;
}
