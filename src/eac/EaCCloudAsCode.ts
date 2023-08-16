import { EaCDetails } from "./EaCDetails.ts";
import { EaCCloudDetails } from "./EaCCloudDetails.ts";
import { EaCLandingZoneAsCode } from "./EaCLandingZoneAsCode.ts";
import { EaCCloudResourceGroupAsCode } from "./EaCCloudResourceGroupAsCode.ts";

export interface EaCCloudAsCode extends EaCDetails<EaCCloudDetails> {
  LandingZones?: { [key: string]: EaCLandingZoneAsCode } | null;
  ResourceGroups?: { [key: string]: EaCCloudResourceGroupAsCode } | null;
  Type?: string | null;
}
