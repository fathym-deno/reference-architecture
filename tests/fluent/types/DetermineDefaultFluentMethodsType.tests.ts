import { runTest } from '../../../src/common/types/testing/runTest.ts';
import type { DetermineDefaultFluentMethodsType } from '../../../src/fluent/types/DetermineDefaultFluentMethodsType.ts';
import type { $FluentTag } from '../../../src/fluent/types/tags/$FluentTag.ts';

Deno.test('Testing DetermineDefaultFluentMethodsType', async (t) => {
  // Test for simple object type
  await t.step('Simple Object Evaluation', () => {
    type Example = { name: string };

    runTest<DetermineDefaultFluentMethodsType<Example>, 'Object'>(
      'Object',
      'Object'
    );
  });

  // Test for Record type (string to number mapping)
  await t.step('Record with Index Signature', () => {
    type Example = Record<string, number>;
    runTest<DetermineDefaultFluentMethodsType<Example>, 'Record'>(
      'Record',
      'Record'
    );
  });

  // Test for simple property (non-object)
  await t.step('Simple Property Evaluation', () => {
    type Example = number;
    runTest<DetermineDefaultFluentMethodsType<Example>, 'Property'>(
      'Property',
      'Property'
    );
  });

  // Test for nested object with index signature
  await t.step('Nested Object with Index Signature', () => {
    type Example = { [key: string]: { value: number } };
    runTest<DetermineDefaultFluentMethodsType<Example>, 'Record'>(
      'Record',
      'Record'
    );
  });

  // Test for union type with object and non-object
  await t.step('Union type with object and non-object', () => {
    type UnionExample = { name: string } | number;
    type check = DetermineDefaultFluentMethodsType<UnionExample>;

    runTest<check, 'Property'>('Property', 'Property');

    runTest<check, 'Object'>('Object', 'Object');
  });

  // Test for complex Record type (Record of objects)
  await t.step('Complex Record Type', () => {
    type ComplexRecord = Record<string, { name: string; age: number }>;
    runTest<DetermineDefaultFluentMethodsType<ComplexRecord>, 'Record'>(
      'Record',
      'Record'
    );
  });

  // Test for optional property (object type)
  await t.step('Optional Property (Object)', () => {
    type Example = { key?: { name: string } };
    runTest<DetermineDefaultFluentMethodsType<Example['key']>, 'Object'>(
      'Object',
      'Object'
    );
  });

  // Test for index signature with more complex types
  await t.step('Index Signature with Complex Types', () => {
    type ComplexExample = { [key: string]: { details: string; count: number } };
    runTest<DetermineDefaultFluentMethodsType<ComplexExample>, 'Record'>(
      'Record',
      'Record'
    );
  });

  await t.step('Record with complex value type', () => {
    type ComplexExample = Record<string, { details: string; count: number }>;
    runTest<DetermineDefaultFluentMethodsType<ComplexExample>, 'Record'>(
      'Record',
      'Record'
    );
  });

  await t.step('Record with Record unknown', () => {
    type ComplexExample = Record<string, unknown>;

    runTest<DetermineDefaultFluentMethodsType<ComplexExample>, 'Record'>(
      'Record',
      'Record'
    );
  });

  await t.step('Record with Record value type with complex value type', () => {
    type ComplexExample = Record<
      string,
      Record<string, { details: string; count: number }>
    >;
    runTest<DetermineDefaultFluentMethodsType<ComplexExample>, 'Record'>(
      'Record',
      'Record'
    );
  });

  await t.step(
    'Record with Record value type with complex value type - Not Record',
    () => {
      type ComplexExample = Record<
        string,
        Record<string, { details: string; count: number }> &
          $FluentTag<'Methods', 'Object'>
      >;

      runTest<DetermineDefaultFluentMethodsType<ComplexExample>, 'Record'>(
        'Record',
        'Record'
      );
    }
  );
});
