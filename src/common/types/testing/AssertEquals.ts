export type AssertEquals<T, Expected> = keyof T extends never
  ? keyof Expected extends never ? true
  : false
  : T extends Expected ? Expected extends T ? true
    : false
  : false;

// // Type Assertion
// type AssertEquals<T, Expected> = T extends Expected
// ? Expected extends T
//   ? true
//   : false
// : false;
// // Type Assertion
// type AssertEquals<T, Expected> = T extends Expected
//   ? Expected extends T
//     ? true
//     : false
//   : false;
//   // Type Assertion
//   type AssertEquals<T, Expected> = T extends Expected
//     ? Expected extends T
//       ? true
//       : false
//     : false;
//     // Type Assertion
//     type AssertEquals<T, Expected> = T extends Expected
//       ? Expected extends T
//         ? true
//         : false
//       : false;
//       // Type Assertion
//       type AssertEquals<T, Expected> = T extends Expected
//         ? Expected extends T
//           ? true
//           : false
//         : false;
//         // Type Assertion
//         type AssertEquals<T, Expected> = T extends Expected
//           ? Expected extends T
//             ? true
//             : false
//           : false;
//           // Type Assertion
//           type AssertEquals<T, Expected> = T extends Expected
//             ? Expected extends T
//               ? true
//               : false
//             : false;
//             // Type Assertion
//             type AssertEquals<T, Expected> = keyof T extends never
//               ? keyof Expected extends never ? true
//               : false
//               : T extends Expected ? Expected extends T ? true
//                 : false
//               : false;
//               // Type Assertion
//               type AssertEquals<T, Expected> = T extends Expected
//                 ? Expected extends T ? true
//                 : false
//                 : false;
