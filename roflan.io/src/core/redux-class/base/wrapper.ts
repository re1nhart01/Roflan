import { Slice, SliceSelectors } from '@reduxjs/toolkit';
import { typedef } from '@core/redux-class/base/index';

export abstract class Wrapper {
    abstract get name(): string;

    abstract get initialState(): Record<string, unknown>;

    public __FUNS__: { [key: string]: Function } = {};

    public internalValue: Slice<Record<string, unknown>, {}, string, string, SliceSelectors<Record<string, unknown>>> | undefined;

    public collect<T>(): T {
      const ownProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
      const that: typedef = this as unknown as typedef;
      return ownProperties.filter((property) =>
        typeof that[property] === 'function' &&
          property !== 'constructor' &&
          that[property].__UNSAFE_THUNK)
        .reduce((el, d) => {
          // @ts-ignore
          el[d] = this[d] as Function;
          return el;
        }, {}) as never;
    }
}
