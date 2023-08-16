import { EaCVertexDetails } from "./EaCVertexDetails.ts";

export interface EaCArtifactDetails extends EaCVertexDetails {
  BuildCommand?: string | null;
  DeployCommand?: string | null;
  InstallCommand?: string | null;
  NPMRegistry?: string | null;
  Output?: string | null;
}
