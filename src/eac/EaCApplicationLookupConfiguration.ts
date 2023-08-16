import { AllAnyTypes } from "./AllAnyTypes.ts";

export interface EaCApplicationLookupConfiguration {
  AccessRightsAllAny: AllAnyTypes;
  HeaderRegex?: string | null;
  IsPrivate?: boolean | null;
  IsTriggerSignIn?: boolean | null;
  LicensesAllAny: AllAnyTypes;
  PathRegex?: string | null;
  QueryRegex?: string | null;
  TerminateRequest?: boolean | null;
  UserAgentRegex?: string | null;
}
