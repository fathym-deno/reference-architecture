import type { EaCDetails } from "./EaCDetails.ts";
import type { EaCEnterpriseDetails } from "./EaCEnterpriseDetails.ts";
import type { EaCAccessRightAsCode } from "./EaCAccessRightAsCode.ts";
import type { EaCApplicationAsCode } from "./EaCApplicationAsCode.ts";
import type { EaCDataTokenAsCode } from "./EaCDataTokenAsCode.ts";
import type { EaCEnvironmentAsCode } from "./EaCEnvironmentAsCode.ts";
import type { EaCHostAsCode } from "./EaCHostAsCode.ts";
import type { EaCLicenseConfigurationAsCode } from "./EaCLicenseConfigurationAsCode.ts";
import type { EaCDFSModifierAsCode } from "./EaCDFSModifierAsCode.ts";
import type { EaCProjectAsCode } from "./EaCProjectAsCode.ts";
import type { EaCProviderAsCode } from "./EaCProviderAsCode.ts";

export interface EverythingAsCode extends EaCDetails<EaCEnterpriseDetails> {
  AccessRights?: { [key: string]: EaCAccessRightAsCode };
  Applications?: { [key: string]: EaCApplicationAsCode };
  DataTokens?: { [key: string]: EaCDataTokenAsCode };
  EnterpriseLookup?: string;
  Environments?: { [key: string]: EaCEnvironmentAsCode };
  Hosts?: { [key: string]: EaCHostAsCode };
  LicenseConfigurations?: { [key: string]: EaCLicenseConfigurationAsCode };
  Modifiers?: { [key: string]: EaCDFSModifierAsCode };
  ParentEnterpriseLookup?: string;
  PrimaryEnvironment?: string;
  PrimaryHost?: string;
  Projects?: { [key: string]: EaCProjectAsCode };
  Providers?: { [key: string]: EaCProviderAsCode };
}
