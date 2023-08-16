import { EaCDetails } from '../EaCDetails.ts';
import { EaCCloudResourceGroupDetails } from './EaCCloudResourceGroupDetails.ts';
import { EaCCloudResourceAsCode } from './EaCCloudResourceAsCode.ts';

export interface EaCCloudResourceGroupAsCode extends EaCDetails<EaCCloudResourceGroupDetails> {
  Resources?: { [key: string]: EaCCloudResourceAsCode };
}