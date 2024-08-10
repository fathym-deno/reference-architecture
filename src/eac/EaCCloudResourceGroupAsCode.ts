import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCCloudResourceGroupDetails } from "./EaCCloudResourceGroupDetails.ts";
import type { EaCCloudResourceAsCode } from "./EaCCloudResourceAsCode.ts";

export interface EaCCloudResourceGroupAsCode
  extends EaCDetails<EaCCloudResourceGroupDetails> {
  Resources?: { [key: string]: EaCCloudResourceAsCode };
}
