import type { EaCVertexDetails } from "./EaCVertexDetails.ts";

export interface EaCDevOpsActionDetails extends EaCVertexDetails {
  Path?: string | null;
  Templates?: string[] | null;
}
