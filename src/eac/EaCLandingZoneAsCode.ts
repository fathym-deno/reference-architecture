import { EaCDetails } from "./EaCDetails.ts";
import { EaCLandingZoneDetails } from "./EaCLandingZoneDetails.ts";
import { EaCLaunchPadAsCode } from "./EaCLaunchPadAsCode.ts";

export interface EaCLandingZoneAsCode
  extends EaCDetails<EaCLandingZoneDetails> {
  LaunchPads?: { [key: string]: EaCLaunchPadAsCode } | null;
}
