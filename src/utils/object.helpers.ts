// deno-lint-ignore-file no-explicit-any
export function merge(
  input: Record<string | number | symbol, any>,
  update: Record<string | number | symbol, any>,
): Record<string | number | symbol, any> {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (!(key in update)) return { ...acc, [key]: value };

    // TODO: How to handle arrays?  Currently overwrites with new array values

    if (
      typeof update[key] === "object" &&
      update[key] !== null &&
      update[key] !== undefined &&
      !Array.isArray(update[key])
    ) {
      return { ...acc, [key]: merge(input[key], update[key]) };
    } else {
      return { ...acc, [key]: update[key] };
    }
  }, {});
}
