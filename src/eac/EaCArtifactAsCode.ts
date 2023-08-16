import { EaCDetails } from './EaCDetails.ts';
import { EaCArtifactDetails } from './EaCArtifactDetails.ts';

export interface EaCArtifactAsCode extends EaCDetails<EaCArtifactDetails> {
  Type?: string | null;
}