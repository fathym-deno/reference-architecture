import { EaCVertexDetails } from "./EaCVertexDetails.ts";

export interface EaCCloudDetails extends EaCVertexDetails {
  ApplicationID?: string | null;
  AuthKey?: string | null;
  SubscriptionID?: string | null;
  TenantID?: string | null;
}
