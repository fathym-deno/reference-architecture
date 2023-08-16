import { EaCDetails } from "./EaCDetails.ts";
import { EaCEnterpriseDetails } from "./EaCEnterpriseDetails.ts";

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
