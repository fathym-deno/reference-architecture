import { EaCMetadataBase } from './EaCMetadataBase.ts';

export interface EaCVertexDetails extends EaCMetadataBase {
  Description?: string | null;
  Name?: string | null;
}