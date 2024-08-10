import type { EaCVertexDetails } from "./EaCVertexDetails.ts";

export interface EaCApplicationDetails extends EaCVertexDetails {
  Priority?: number;
  PriorityShift?: number;
}
