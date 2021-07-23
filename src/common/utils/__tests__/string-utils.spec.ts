import {
  formatDecimal,
  formatFloat,
  toLowerCamel,
  toLowerFirstLetter,
  toLowerSnakeCase,
  toUpperCamel,
  toUpperFirstLetter,
  toUpperSnakeCase,
} from '..';

describe('Strings', () => {
  it('Should be able to convert strings to upper and lower snake case', () => {
    const inputStrings = ['testString', 'thisIsATestString', 'wow_yetAnother_test'];
    const lowerSnakeCaseStrings = ['test_string', 'this_is_a_test_string', 'wow_yet_another_test'];
    const upperSnakeCaseStrings = ['TEST_STRING', 'THIS_IS_A_TEST_STRING', 'WOW_YET_ANOTHER_TEST'];

    for (let i = 0; i < inputStrings.length; i++) {
      const lowerResult = toLowerSnakeCase(inputStrings[i]);
      const upperResult = toUpperSnakeCase(inputStrings[i]);
      expect(lowerResult).toEqual(lowerSnakeCaseStrings[i]);
      expect(upperResult).toEqual(upperSnakeCaseStrings[i]);
    }
  });

  it('Should be able to convert strings to upper and lower camel case', () => {
    const inputStrings = ['Test__String', 'this_Is_A_Test_String', '_wow_yet_Another_test_'];
    const lowerCamelCaseStrings = ['testString', 'thisIsATestString', 'wowYetAnotherTest'];
    const upperCamelCaseStrings = ['TestString', 'ThisIsATestString', 'WowYetAnotherTest'];

    for (let i = 0; i < inputStrings.length; i++) {
      const lowerResult = toLowerCamel(inputStrings[i]);
      const upperResult = toUpperCamel(inputStrings[i]);
      expect(lowerResult).toEqual(lowerCamelCaseStrings[i]);
      expect(upperResult).toEqual(upperCamelCaseStrings[i]);
    }
  });

  it('Should be able to change the first and last letters of strings', () => {
    const inputStrings = ['Test__String', 'this_Is_A_Test_String', 'wow_yet_Another_test_'];
    const lowerFirstLetterStrings = ['test__String', 'this_Is_A_Test_String', 'wow_yet_Another_test_'];
    const upperFirstLetterStrings = ['Test__String', 'This_Is_A_Test_String', 'Wow_yet_Another_test_'];

    for (let i = 0; i < inputStrings.length; i++) {
      const lowerResult = toLowerFirstLetter(inputStrings[i]);
      const upperResult = toUpperFirstLetter(inputStrings[i]);
      expect(lowerResult).toEqual(lowerFirstLetterStrings[i]);
      expect(upperResult).toEqual(upperFirstLetterStrings[i]);
    }
  });

  it('Should be able to format floating point numbers', () => {
    const testSets: Array<[number, number | false, string]> = [
      [1.14, false, '1.14'],
      [1.14345, false, '1.14345'],
      [1.145643, 2, '1.15'],
      [1.13456, 3, '1.135'],
      [1.2344, 1, '1.2'],
      [1.764514, 0, '1.764514'],
      [1.2341, 5, '1.23410'],
      [1, 6, '1.000000'],
    ];

    for (const [value, decimalPlaces, expectedResult] of testSets) {
      expect(formatFloat(value, decimalPlaces)).toEqual(expectedResult);
    }
  });

  it('Should be able to format decimal numbers', () => {
    const testSets: Array<[number, string]> = [
      [1.14, '1.14'],
      [1, '1.00'],
      [1.1, '1.10'],
      [1.1456, '1.15'],
      [999.14, '999.14'],
      [1000.14, '1,000.14'],
      [1000000000.14, '1,000,000,000.14'],
    ];

    for (const [value, expectedResult] of testSets) {
      expect(formatDecimal(value)).toEqual(expectedResult);
    }
  });
});
