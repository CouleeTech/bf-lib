import { getFields, removeField } from '../functional.utils';

describe('removeField', async () => {
  it('removeField', async () => {
    expect(removeField('test')({ test: 'item', list: 'thing' })).toEqual({ list: 'thing' });
  });
});

describe('removeField2', async () => {
  it('removeField2', async () => {
    expect(removeField('test')({ test: 'item', list: 'thing', teste: 'thing' })).toEqual({
      list: 'thing',
      teste: 'thing',
    });
  });
});
describe('getFields', async () => {
  it('getFields', async () => {
    expect(getFields('test')({ test: 'item', list: 'thing', teste: 'thing' })).toEqual({ test: 'item' });
  });
});
