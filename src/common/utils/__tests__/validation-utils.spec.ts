import { isValidEmail } from '../../utils';

describe('Validation', () => {
  it('Should validate email addresses', () => {
    const passValues = ['bob@bob.com'];

    for (const value of passValues) {
      expect(isValidEmail(value)).toBeTruthy();
    }

    const failValues = [
      '',
      Symbol(),
      true,
      false,
      22,
      -1,
      -0,
      Infinity,
      NaN,
      null,
      undefined,
      new Map(),
      new Set(),
      [],
      {},
      'test',
      'test@',
      'test@test',
      'test.com',
      'test.test.com',
      'test@test.',
    ];

    for (const value of failValues) {
      expect(isValidEmail(value as any)).toBeFalsy();
    }
  });
});
