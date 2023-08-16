import { EaCCloudDetails } from "./EaCCloudDetails";
import { EaCDetails } from "./EaCDetails";
import { EaCLandingZoneAsCode } from "./EaCLandingZoneAsCode";
import { EaCCloudResourceGroupAsCode } from "./EaCCloudResourceGroupAsCode";

export interface EaCCloudAsCode extends EaCDetails<EaCCloudDetails> {
  LandingZones?: Record<string, EaCLandingZoneAsCode>;
  ResourceGroups?: Record<string, EaCCloudResourceGroupAsCode>;
  Type?: string;
}