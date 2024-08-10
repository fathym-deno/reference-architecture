import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCPackageDetails } from "./EaCPackageDetails.ts";

export interface EaCPackage extends EaCDetails<EaCPackageDetails> {
  SourceControlLookup?: string | null;
  Type?: string | null;
}
