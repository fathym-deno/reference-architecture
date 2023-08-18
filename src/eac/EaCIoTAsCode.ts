import { EaCDetails } from "./EaCDetails.ts";
import { EaCIoTDetails } from "./EaCIoTDetails.ts";
import { EaCIoTDeviceTypeAsCode } from "./EaCIoTDeviceTypeAsCode.ts";

export interface EaCIoTAsCode extends EaCDetails<EaCIoTDetails> {
  DeviceTypes?: { [key: string]: EaCIoTDeviceTypeAsCode } | null;
}
