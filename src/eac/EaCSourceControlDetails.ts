import type { EaCVertexDetails } from "./EaCVertexDetails.ts";

export interface EaCSourceControlDetails extends EaCVertexDetails {
  Branches?: string[] | null;
  MainBranch?: string | null;
  Organization?: string | null;
  Repository?: string | null;
  Username?: string | null;
}
