import { EaCDetails } from "../EaCDetails.ts";
import { EaCPlanDetails } from "./EaCPlanDetails.ts";
import { EaCPriceAsCode } from "./EaCPriceAsCode.ts";

export interface EaCPlanAsCode extends EaCDetails<EaCPlanDetails> {
  Prices?: { [key: string]: EaCPriceAsCode } | null;
}