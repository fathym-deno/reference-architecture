import { EaCDetails } from "./EaCDetails.ts";
import { EaCCloudResourceDetails } from "./EaCCloudResourceDetails.ts";

export interface EaCCloudResourceAsCode
  extends EaCDetails<EaCCloudResourceDetails> {
  Resources?: { [key: string]: EaCCloudResourceAsCode };
}
