import { EaCDetails } from "./EaCDetails.ts";
import { EaCEnvironmentDetails } from "./EaCEnvironmentDetails.ts";
import { EaCArtifactAsCode } from "./EaCArtifactAsCode.ts";
import { EaCCloudAsCode } from "./EaCCloudAsCode.ts";
import { EaCDevOpsActionAsCode } from "./EaCDevOpsActionAsCode.ts";
import { EaCSecretAsCode } from "./EaCSecretAsCode.ts";
import { EaCSourceControlAsCode } from "./EaCSourceControlAsCode.ts";
import { EaCIoTAsCode } from "./EaCIoTAsCode.ts";

export interface EaCEnvironmentAsCode
  extends EaCDetails<EaCEnvironmentDetails> {
  Artifacts?: { [key: string]: EaCArtifactAsCode } | null;
  Clouds?: { [key: string]: EaCCloudAsCode } | null;
  DevOpsActions?: { [key: string]: EaCDevOpsActionAsCode } | null;
  Secrets?: { [key: string]: EaCSecretAsCode } | null;
  Sources?: { [key: string]: EaCSourceControlAsCode } | null;
  IoT?: { [key: string]: EaCIoTAsCode } | null;
}
