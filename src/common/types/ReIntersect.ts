// deno-lint-ignore-file no-explicit-any
export type ReIntersect<U> = (U extends any ? (x: U) => void : never) extends
  (x: infer I) => void ? I : never;
