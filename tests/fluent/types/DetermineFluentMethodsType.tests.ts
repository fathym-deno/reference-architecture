import { runTest } from '../../../src/common/types/testing/runTest.ts';
import type { DetermineFluentMethodsType } from '../../../src/fluent/types/DetermineFluentMethodsType.ts';
import type { $FluentTag } from '../../../src/fluent/types/tags/$FluentTag.ts';

Deno.test('DetermineFluentMethodsType', async (t) => {
  await t.step('Automatic Resolution', async (t) => {
    await t.step('Basic Tests', async (t) => {
      await t.step('With FluentTag - Record', () => {
        type Example = $FluentTag<'Methods', 'Record'>;

        runTest<DetermineFluentMethodsType<Example>, 'Record'>(
          'Record',
          'Record'
        );
      });

      await t.step('With FluentTag - Object', () => {
        type Example = $FluentTag<'Methods', 'Object'>;

        runTest<DetermineFluentMethodsType<Example>, 'Object'>(
          'Object',
          'Object'
        );
      });

      await t.step('With FluentTag - Property', () => {
        type Example = $FluentTag<'Methods', 'Property'>;

        runTest<DetermineFluentMethodsType<Example>, 'Property'>(
          'Property',
          'Property'
        );
      });

      await t.step('Without FluentTag (Fallback to Default)', () => {
        type ExampleWithoutTag = {
          property: string;
        };

        runTest<DetermineFluentMethodsType<ExampleWithoutTag>, 'Object'>(
          'Object',
          'Object'
        );
      });

      await t.step('Without FluentTag (Fallback to Record)', () => {
        type ExampleWithoutTag = Record<string, string>;

        runTest<DetermineFluentMethodsType<ExampleWithoutTag>, 'Record'>(
          'Record',
          'Record'
        );
      });
    });

    await t.step('Union Type Tests', async (t) => {
      await t.step('Union with FluentTag and no tag', () => {
        type UnionExample = { property: string } & $FluentTag<
          'Methods',
          'Object'
        >;

        runTest<DetermineFluentMethodsType<UnionExample>, 'Object'>(
          'Object',
          'Object'
        );
      });

      // Union test with Object and Record
      await t.step('Union between Object and Record', () => {
        type UnionExample =
          | $FluentTag<'Methods', 'Object'>
          | Record<string, string>;

        runTest<DetermineFluentMethodsType<UnionExample>, 'Object' | 'Record'>(
          'Object',
          'Object'
        );
      });

      // Union test where part of union has no FluentTag
      await t.step('Union with FluentTag and no FluentTag', () => {
        type UnionExample =
          | string
          | ({ otherProperty: string } & $FluentTag<'Methods', 'Object'>);

        runTest<
          DetermineFluentMethodsType<UnionExample>,
          'Object' | 'Property'
        >('Object', 'Object');
      });

      // Complex union type test
      await t.step(
        'Complex Union with FluentTag and different properties',
        () => {
          type UnionExample =
            | ({ key: number } & $FluentTag<'Methods', 'Object'>)
            | ({ key: string } & $FluentTag<'Methods', 'Record'>);

          runTest<
            DetermineFluentMethodsType<UnionExample>,
            'Object' | 'Record'
          >('Object', 'Object');
        }
      );
    });

    await t.step('Record Type Tests', async (t) => {
      await t.step('Record type with FluentTag', () => {
        type RecordExample = Record<string, $FluentTag<'Methods', 'Record'>>;

        runTest<DetermineFluentMethodsType<RecordExample>, 'Record'>(
          'Record',
          'Record'
        );
      });
    });

    await t.step('Complex Nested Types', async (t) => {
      await t.step('Nested structure with FluentTag', () => {
        type ComplexNested = {
          outer: $FluentTag<'Methods', 'Object'>;
        };

        runTest<DetermineFluentMethodsType<ComplexNested['outer']>, 'Object'>(
          'Object',
          'Object'
        );
      });
    });

    await t.step('Fallback for Index Signatures', async (t) => {
      await t.step('Defaults to Record with index signatures', () => {
        type FallbackIndexSignature = Record<string, unknown>;

        runTest<DetermineFluentMethodsType<FallbackIndexSignature>, 'Record'>(
          'Record',
          'Record'
        );
      });
    });

    await t.step('Complex from EaC', () => {
      type EaCModuleHandler = {
        APIPath: string;
        Order: number;
      };
      type EaCModuleHandlers = {
        $Force?: boolean;
      } & Record<string, EaCModuleHandler & $FluentTag<'Methods', 'Object'>>;

      type IndexSignature = {
        Handlers?: EaCModuleHandlers;
      };

      runTest<DetermineFluentMethodsType<IndexSignature>, 'Object'>(
        'Object',
        'Object'
      );
    });
  });
});
