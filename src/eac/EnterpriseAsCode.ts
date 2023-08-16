import { EaCDetails } from './EaCDetails.ts';
import { EaCVertexDetails } from './EaCVertexDetails.ts';
import { EaCEnterpriseDetails } from './EaCEnterpriseDetails.ts';
import { EaCMetadataBase } from './EaCMetadataBase.ts';

export interface EnterpriseAsCode extends EaCDetails<EaCEnterpriseDetails> {
  // The rest of the file remains the same
}