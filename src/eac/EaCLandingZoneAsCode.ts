import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCLandingZoneDetails } from "./EaCLandingZoneDetails.ts";
import type { EaCLaunchPadAsCode } from "./EaCLaunchPadAsCode.ts";

export interface EaCLandingZoneAsCode
  extends EaCDetails<EaCLandingZoneDetails> {
  LaunchPads?: { [key: string]: EaCLaunchPadAsCode } | null;
}
