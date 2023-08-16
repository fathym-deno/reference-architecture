import { EaCDetails } from "./EaCDetails.ts";
import { EaCLaunchPadDetails } from "./EaCLaunchPadDetails.ts";
import { EaCOverhaulAsCode } from "./EaCOverhaulAsCode.ts";

export interface EaCLaunchPadAsCode extends EaCDetails<EaCLaunchPadDetails> {
  Overhauls?: { [key: string]: EaCOverhaulAsCode } | null;
}
