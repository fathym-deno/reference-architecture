import type { $TagStrip } from '../../../../src/common/types/.exports.ts';
import type { $TagExtractDataKeys } from '../../../../src/common/types/tags/$TagExtractDataKeys.ts';
import type {
  $Tag,
  $TagExists,
  $TagExtract,
  $TagExtractValue,
  $TagExtractValues,
  $TagValues,
} from '../../../../src/common/types/tags/.exports.ts';
import { assert, assertEquals, assertFalse } from '../../../test.deps.ts';

Deno.test('$Tag Tests', async (t) => {
  type testTag = $TagValues<
    'Test',
    'Thing',
    'value' | 'trim',
    { trim: 'true'; value: 'false' }
  >;

  const check: testTag = {
    '@Test': 'Thing',
    '@Test-trim': 'true',
    '@Test-value': 'false',
  };

  await t.step('Tag Creation', () => {
    assert(check);
    assertEquals(check['@Test-trim'], 'true');
    assertEquals(check['@Test-value'], 'false');

    type testValue = NonNullable<testTag['@Test-value']> extends 'false'
      ? true
      : false;

    const checkValue: testValue = true;

    assert(checkValue);
  });

  await t.step('Tag Data Keys', () => {
    type tagDataKeys = $TagExtractDataKeys<testTag, 'Test', 'Thing'>;

    const dataKeys: tagDataKeys = 'trim';

    assert(dataKeys);
    assertEquals(dataKeys, 'trim');
  });

  await t.step('Tag Exists', () => {
    type tagExists = {
      Type: $TagExists<testTag, 'Test'>;
      TypeTag: $TagExists<testTag, 'Test', 'Thing'>;
      TypeTagValues: $TagExists<testTag, 'Test', 'Thing', 'trim'>;
      TypeTagValuesBoth: $TagExists<testTag, 'Test', 'Thing', 'trim' | 'value'>;
      TypeTagValuesPartial: $TagExists<
        testTag,
        'Test',
        'Thing',
        'trim' | 'Bad'
      >;
      BadType: $TagExists<testTag, 'Bad', 'Thing', 'trim'>;
      BadTag: $TagExists<testTag, 'Test', 'Bad', 'trim'>;
      BadTypeTag: $TagExists<testTag, 'Bad', 'Bad', 'trim'>;
      BadTypeTagValues: $TagExists<testTag, 'Test', 'Thing', 'Bad'>;
      BadTypeTagValuesBoth: $TagExists<testTag, 'Test', 'Thing', 'Bad' | 'Bad'>;
    };

    const d: tagExists = {
      Type: true,
      TypeTag: true,
      TypeTagValues: true,
      TypeTagValuesBoth: true,
      TypeTagValuesPartial: true,
      BadType: false,
      BadTag: false,
      BadTypeTag: false,
      BadTypeTagValues: false,
      BadTypeTagValuesBoth: false,
    };

    assert(d);
    assert(d.Type);
    assert(d.TypeTag);
    assert(d.TypeTagValues);
    assert(d.TypeTagValuesBoth);
    assert(d.TypeTagValuesPartial);
    assertFalse(d.BadType);
    assertFalse(d.BadTag);
    assertFalse(d.BadTypeTag);
    assertFalse(d.BadTypeTagValues);
    assertFalse(d.BadTypeTagValuesBoth);
  });

  await t.step('Tag Record Exists', () => {
    type recordTest =
      Record<
          string,
          {
            BringIt: boolean;
          }
        >
      & testTag;

    type tagExists = {
      Type: $TagExists<recordTest, 'Test'>;
      TypeTag: $TagExists<recordTest, 'Test', 'Thing'>;
      TypeTagValues: $TagExists<recordTest, 'Test', 'Thing', 'trim'>;
      TypeTagValuesBoth: $TagExists<
        recordTest,
        'Test',
        'Thing',
        'trim' | 'value'
      >;
      TypeTagValuesPartial: $TagExists<
        recordTest,
        'Test',
        'Thing',
        'trim' | 'Bad'
      >;
      BadType: $TagExists<recordTest, 'Bad', 'Thing', 'trim'>;
      BadTag: $TagExists<recordTest, 'Test', 'Bad', 'trim'>;
      BadTypeTag: $TagExists<recordTest, 'Bad', 'Bad', 'trim'>;
      BadTypeTagValues: $TagExists<recordTest, 'Test', 'Thing', 'Bad'>;
      BadTypeTagValuesBoth: $TagExists<
        recordTest,
        'Test',
        'Thing',
        'Bad' | 'Bad'
      >;
    };

    const d: tagExists = {
      Type: true,
      TypeTag: true,
      TypeTagValues: true,
      TypeTagValuesBoth: true,
      TypeTagValuesPartial: true,
      BadType: false,
      BadTag: false,
      BadTypeTag: false,
      BadTypeTagValues: false,
      BadTypeTagValuesBoth: false,
    };

    assert(d);
    assert(d.Type);
    assert(d.TypeTag);
    assert(d.TypeTagValues);
    assert(d.TypeTagValuesBoth);
    assert(d.TypeTagValuesPartial);
    assertFalse(d.BadType);
    assertFalse(d.BadTag);
    assertFalse(d.BadTypeTag);
    assertFalse(d.BadTypeTagValues);
    assertFalse(d.BadTypeTagValuesBoth);
  });

  await t.step('Tag Extracts', () => {
    type tag = $TagExtract<testTag, 'Test'>;

    const tagged: tag = 'Thing';

    assert(tagged);
    assertEquals(tagged, 'Thing');

    type tagValue = $TagExtractValue<testTag, 'Test', tag, 'trim'>;

    type tagValueCheck = tagValue extends 'true' ? true : false;

    const value: tagValueCheck = true;

    assertEquals(value, true);

    type tagValues = $TagExtractValues<testTag, 'Test', tag, 'trim' | 'value'>;

    type tagValueChecks = {
      [KValue in keyof tagValues]: {
        [K in keyof tagValues[KValue]]: K extends 'trim'
          ? tagValues[KValue]['trim'] extends 'true'
            ? true
            : false
          : K extends 'value'
          ? tagValues[KValue]['value'] extends 'false'
            ? true
            : false
          : false;
      };
    };

    const values: tagValueChecks = {
      Test: {
        trim: true,
        value: true,
      },
    };

    assert(values?.Test?.trim);
    assert(values?.Test?.value);
    assertEquals(values?.Test?.trim, true);
    assertEquals(values?.Test?.value, false);
  });

  await t.step('Tag Record Extracts', () => {
    type recordTest =
      | Record<
          string,
          {
            BringIt: boolean;
          }
        >
      | testTag;

    type tag = $TagExtract<recordTest, 'Test'>;

    const tagged: tag = 'Thing';

    assert(tagged);
    assertEquals(tagged, 'Thing');

    type tagValue = $TagExtractValue<recordTest, 'Test', tag, 'trim'>;

    const value: tagValue = 'true';

    assertEquals(value, 'true');

    type tagValues = $TagExtractValues<
      recordTest,
      'Test',
      tag,
      'trim' | 'value'
    >;

    const values: tagValues = {
      Test: {
        trim: 'true',
        value: 'false',
      },
    };

    assert(values?.Test?.trim);
    assert(values?.Test?.value);
    assertEquals(values?.Test?.trim, 'true');
    assertEquals(values?.Test?.value, 'false');
  });

  await t.step('Tag Stripped', () => {
    type tagStripped1 = $TagStrip<testTag, 'Test'>;

    const stripped1: tagStripped1 = {};

    assert(stripped1);

    type tagStripped2 = $TagStrip<testTag, 'Test', 'Thing', 'trim'>;

    const stripped2: tagStripped2 = {
      '@Test': 'Thing',
      '@Test-value': 'false',
    };

    assert(stripped2);
    assertEquals(stripped2['@Test'], 'Thing');
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(stripped2['@Test-trim']);
    assertEquals(stripped2['@Test-value'], 'false');

    type tagStripped3 = $TagStrip<testTag, 'Test', 'Thing', 'trim' | 'value'>;

    const stripped3: tagStripped3 = {
      '@Test': 'Thing',
    };

    assert(stripped3);
    assertEquals(stripped3['@Test'], 'Thing');
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(stripped3['@Test-trim']);
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(stripped3['@Test-value']);

    type tagStripped4 = $TagStrip<testTag, 'Test', 'Thing', never, true>;

    const stripped4: tagStripped4 = {
      '@Test-trim': 'true',
      '@Test-value': 'false',
    };

    assert(stripped4);
    // @ts-ignore Ignore missing property, to enforce assertion
    assertFalse(stripped4['@Test']);
    assertEquals(stripped4['@Test-trim'], 'true');
    assertEquals(stripped4['@Test-value'], 'false');
  });
});
