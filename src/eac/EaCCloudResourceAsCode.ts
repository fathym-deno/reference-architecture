import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCCloudResourceDetails } from "./EaCCloudResourceDetails.ts";

export interface EaCCloudResourceAsCode
  extends EaCDetails<EaCCloudResourceDetails> {
  Resources?: { [key: string]: EaCCloudResourceAsCode };
}
