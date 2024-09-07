export type AssertEquals<T, Expected> = [T] extends [never] // Check if T is never
  ? [Expected] extends [never] // If T is never, ensure Expected is also never
    ? true
  : false
  : [Expected] extends [never] // If T is not never but Expected is never
    ? false
  : T extends Expected ? Expected extends T ? true
    : false
  : false;
