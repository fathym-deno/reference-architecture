import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCPlanDetails } from "./EaCPlanDetails.ts";
import type { EaCPriceAsCode } from "./EaCPriceAsCode.ts";

export interface EaCPlanAsCode extends EaCDetails<EaCPlanDetails> {
  Prices?: { [key: string]: EaCPriceAsCode } | null;
}
