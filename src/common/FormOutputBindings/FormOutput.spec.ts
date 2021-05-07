import { defaultContext } from './test_data/defaultContext';
import { resolveOutputBindingValue } from './FormOutputBindings';

describe('Form Bindings resolveOutputBindingValue', () => {
  it('resolveOutputBindingValue type of VALUE', async () => {
    expect(
      resolveOutputBindingValue(
        {
          type: 'VALUE',
          value: 10,
        },
        { ...defaultContext, form_data: {} },
      ),
    ).toEqual(10);
    expect(
      resolveOutputBindingValue(
        {
          type: 'VALUE',
          value: '10',
        },
        { ...defaultContext, form_data: {} },
      ),
    ).not.toEqual(10);
    expect(
      resolveOutputBindingValue(
        {
          type: 'VALUE',
          value: 'testing',
        },
        { ...defaultContext, form_data: {} },
      ),
    ).not.toEqual('testing');
  });
});
