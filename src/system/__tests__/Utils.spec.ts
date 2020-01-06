import { makeCallable, proxyWrap } from '../Utils';

describe('Utils', () => {
  it('Should be able to wrap objects in a proxy object', () => {
    let count = 0;
    function wrapperUtil() {
      count++;
    }

    const [target, proxy] = proxyWrap({}, { wrapperUtil });

    expect(target).toBeTruthy();
    expect(proxy).toBeTruthy();

    expect(count).toEqual(0);
    proxy.wrapperUtil();
    expect(count).toEqual(1);
    expect(() => proxy.test()).toThrowError();

    target.test = () => {
      return 'TARGET STUFF';
    };

    expect(proxy.test()).toEqual('TARGET STUFF');

    target.wrapperUtil = () => {
      return 'TARGET STUFF';
    };

    expect(count).toEqual(1);
    expect(proxy.wrapperUtil()).toEqual('TARGET STUFF');
    expect(count).toEqual(2);
  });

  it('Should be able to make an object callable with a supplied function', () => {
    const obj = { a: () => 1, b: () => 2 };
    const func = () => 3;

    const callable = makeCallable(func, obj);

    expect(callable.a()).toEqual(1);
    expect(callable.b()).toEqual(2);
    expect(callable()).toEqual(3);
  });
});
