import { deepMerge } from "$std/collections/mod.ts";

export function merge<T>(...inputs: object[]): T {
  return inputs.reduce((prev, cur) => {
    return deepMerge(prev, cur, {
      arrays: "replace",
      maps: "replace",
      sets: "replace",
    });
  }, {}) as T;
}

export function mergeWithArrays<T>(...inputs: object[]): T {
  return inputs.reduce((prev, cur) => {
    return deepMerge(prev, cur);
  }, {}) as T;
}