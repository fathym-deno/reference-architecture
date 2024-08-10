import type { EaCVertexDetails } from "./EaCVertexDetails.ts";

export interface EaCIoTDetails extends EaCVertexDetails {
  EmulatedEnabled?: boolean | null;
}
