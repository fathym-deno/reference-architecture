// deno-lint-ignore-file no-explicit-any
// Utility type to convert union to intersection
export type UnionToIntersection<U> = (
  U extends any ? (x: U) => void : never
) extends (x: infer R) => void ? R
  : never;
