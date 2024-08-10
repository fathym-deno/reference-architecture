import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCEnvironmentDetails } from "./EaCEnvironmentDetails.ts";
import type { EaCArtifactAsCode } from "./EaCArtifactAsCode.ts";
import type { EaCCloudAsCode } from "./EaCCloudAsCode.ts";
import type { EaCDevOpsActionAsCode } from "./EaCDevOpsActionAsCode.ts";
import type { EaCSecretAsCode } from "./EaCSecretAsCode.ts";
import type { EaCSourceControlAsCode } from "./EaCSourceControlAsCode.ts";
import type { EaCIoTAsCode } from "./EaCIoTAsCode.ts";

export interface EaCEnvironmentAsCode
  extends EaCDetails<EaCEnvironmentDetails> {
  Artifacts?: { [key: string]: EaCArtifactAsCode } | null;
  Clouds?: { [key: string]: EaCCloudAsCode } | null;
  DevOpsActions?: { [key: string]: EaCDevOpsActionAsCode } | null;
  Secrets?: { [key: string]: EaCSecretAsCode } | null;
  Sources?: { [key: string]: EaCSourceControlAsCode } | null;
  IoT?: { [key: string]: EaCIoTAsCode } | null;
}
