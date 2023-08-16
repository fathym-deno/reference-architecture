import { EaCProviderDetails } from './EaCProviderDetails.ts';
import { EaCDetails } from './EaCDetails.ts';

export interface EaCProviderAsCode extends EaCDetails<EaCProviderDetails> {
  Type?: string | null;
}