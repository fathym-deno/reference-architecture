import { EaCVertexDetails } from './EaCVertexDetails';

export interface EaCApplicationDetails extends EaCVertexDetails {
  Priority?: number;
  PriorityShift?: number;
}