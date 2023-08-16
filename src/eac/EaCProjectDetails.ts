import { EaCVertexDetails } from "./EaCVertexDetails.ts";

export interface EaCProjectDetails extends EaCVertexDetails {
  IsInheritable?: boolean | null;
  IsInheritableByChild?: boolean | null;
  PreventInheritedApplications?: boolean | null;
}
