export interface EaCProcessorDetails {
  CacheControl?: string | null;
  Priority?: number | null;
  BaseHref?: string | null;
  DefaultFile?: string | null;
  Scopes?: string[] | null;
  InboundPath?: string | null;
  TokenLookup?: string | null;
  IncludeRequest?: boolean | null;
  Permanent?: boolean | null;
  PreserveMethod?: boolean | null;
  Redirect?: string | null;
}