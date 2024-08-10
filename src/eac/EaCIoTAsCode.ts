import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCIoTDetails } from "./EaCIoTDetails.ts";
import type { EaCIoTDeviceTypeAsCode } from "./EaCIoTDeviceTypeAsCode.ts";

export interface EaCIoTAsCode extends EaCDetails<EaCIoTDetails> {
  DeviceTypes?: { [key: string]: EaCIoTDeviceTypeAsCode } | null;
}
