import { EaCDetails } from './EaCDetails';
import { EaCIoTDeviceTypeAsCode } from './EaCIoTDeviceTypeAsCode';

export interface EaCIoTAsCode extends EaCDetails<EaCIoTDetails> {
  DeviceTypes?: { [key: string]: EaCIoTDeviceTypeAsCode } | null;
}