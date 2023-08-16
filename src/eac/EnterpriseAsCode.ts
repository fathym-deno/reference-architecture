import { EaCDetails } from "./EaCDetails.ts";
import { EaCEnterpriseDetails } from "./EaCEnterpriseDetails.ts";
import { EaCAccessRightAsCode } from "./EaCAccessRightAsCode.ts";
import { EaCApplicationAsCode } from "./EaCApplicationAsCode.ts";
import { EaCDataTokenAsCode } from "./EaCDataTokenAsCode.ts";
import { EaCEnvironmentAsCode } from "./EaCEnvironmentAsCode.ts";
import { EaCHostAsCode } from "./EaCHostAsCode.ts";
import { EaCLicenseConfigurationAsCode } from "./EaCLicenseConfigurationAsCode.ts";
import { EaCDFSModifierAsCode } from "./EaCDFSModifierAsCode.ts";
import { EaCProjectAsCode } from "./EaCProjectAsCode.ts";
import { EaCProviderAsCode } from "./EaCProviderAsCode.ts";

export interface EnterpriseAsCode extends EaCDetails<EaCEnterpriseDetails> {
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