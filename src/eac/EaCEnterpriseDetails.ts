import { EaCVertexDetails } from './EaCVertexDetails.ts';

export interface EaCEnterpriseDetails extends EaCVertexDetails {
}

export interface EaCApplicationDetails {
  Priority?: number | null;
  PriorityShift?: number | null;
}