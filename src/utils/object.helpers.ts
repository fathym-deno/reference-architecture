// // // deno-lint-ignore-file no-explicit-any
// // export function merge(
// //   input: Record<string | number | symbol, unknown>,
// //   update: Record<string | number | symbol, unknown>,
// // ): Record<string | number | symbol, unknown> {
// //   return Object.entries(input).reduce((acc, [key, value]) => {
// //     if (!(key in update)) return { ...acc, [key]: value };

// //     // TODO: How to handle arrays?  Currently overwrites with new array values

// //     if (
// //       typeof update[key] === "object" &&
// //       update[key] !== null &&
// //       update[key] !== undefined &&
// //       !Array.isArray(update[key])
// //     ) {
// //       return { ...acc, [key]: merge((input as any)[key], update[key] as any) };
// //     } else {
// //       return { ...acc, [key]: update[key] };
// //     }
// //   }, {});
// // }
// import deepmerge from "npm:ts-deepmerge";

// export const merge: {
//   <T extends IObject[]>(...objects: T): TMerged<T[number]>;
//   options: IOptions;
//   withOptions<T_1 extends IObject[]>(options: Partial<IOptions>, ...objects: T_1): TMerged<T_1[number]>;
// } = deepmerge;
