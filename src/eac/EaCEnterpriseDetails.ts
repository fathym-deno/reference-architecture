import { EaCAccessRightAsCode } from './EaCAccessRightAsCode';
import { EaCApplicationAsCode } from './EaCApplicationAsCode';
import { EaCDataTokenAsCode } from './EaCDataTokenAsCode';
import { EaCEnvironmentAsCode } from './EaCEnvironmentAsCode';
import { EaCHostAsCode } from './EaCHostAsCode';
import { EaCLicenseConfigurationAsCode } from './EaCLicenseConfigurationAsCode';
import { EaCDFSModifierAsCode } from './EaCDFSModifierAsCode';
import { EaCProjectAsCode } from './EaCProjectAsCode';
import { EaCProviderAsCode } from './EaCProviderAsCode';

export interface EaCEnterpriseDetails {
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