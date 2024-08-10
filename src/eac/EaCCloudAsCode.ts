import type { EaCCloudDetails } from "./EaCCloudDetails.ts";
import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCLandingZoneAsCode } from "./EaCLandingZoneAsCode.ts";
import type { EaCCloudResourceGroupAsCode } from "./EaCCloudResourceGroupAsCode.ts";

export interface EaCCloudAsCode extends EaCDetails<EaCCloudDetails> {
  LandingZones?: Record<string, EaCLandingZoneAsCode>;
  ResourceGroups?: Record<string, EaCCloudResourceGroupAsCode>;
  Type?: string;
}
