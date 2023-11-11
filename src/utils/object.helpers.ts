import deepmerge from "npm:ts-deepmerge";

export function merge<T>(
  ...inputs: Record<string | number | symbol, unknown>[]
): T {
  return deepmerge.withOptions(
    {
      mergeArrays: false,
    },
    ...inputs,
  ) as T;
}

export function mergeWithArrays<T>(
  ...inputs: Record<string | number | symbol, unknown>[]
): T {
  return deepmerge.withOptions(
    {
      mergeArrays: true,
    },
    ...inputs,
  ) as T;
}
