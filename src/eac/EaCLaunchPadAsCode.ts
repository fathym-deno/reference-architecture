import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCLaunchPadDetails } from "./EaCLaunchPadDetails.ts";
import type { EaCOverhaulAsCode } from "./EaCOverhaulAsCode.ts";

export interface EaCLaunchPadAsCode extends EaCDetails<EaCLaunchPadDetails> {
  Overhauls?: { [key: string]: EaCOverhaulAsCode } | null;
}
