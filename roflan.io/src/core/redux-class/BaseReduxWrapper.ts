import { Slice, SliceSelectors, createSlice } from '@reduxjs/toolkit';

type FunctionNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type reduxthunkdef<T, STORE extends BaseReduxWrapper> = (state: Pick<STORE, 'initialState'>, actions: Pick<STORE, FunctionNames<STORE>>, store: { a: 454 }) => Promise<void>;
type typedef = { [key: string]: { [key: string]: unknown } };

export type RRState<STORE extends BaseReduxWrapper> = { [key in keyof STORE['initialState']]: STORE['initialState'][key] };
export type RRActions<STORE extends BaseReduxWrapper> = Pick<STORE, FunctionNames<STORE>>;
export type RRStore<STORE extends BaseReduxWrapper> = { a: 545 };

export abstract class BaseReduxWrapper {
    abstract get name(): string;

    abstract get initialState(): Record<string, unknown>;

    public __FUNS__: { [key: string]: Function } = {};

    public __VALUE__: Slice<Record<string, unknown>, {}, string, string, SliceSelectors<Record<string, unknown>>> | undefined;

    public __C__() {
      const ownProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
      const that: typedef = this as unknown as typedef;
      const functions: { [key: string]: Function } = ownProperties.filter((property) =>
        typeof that[property] === 'function' &&
          property !== 'constructor' &&
          that[property].__UNSAFE_THUNK)
        .reduce((el, d) => {
          // @ts-ignore
          el[d] = this[d] as Function;
          return el;
        }, {});
      return functions;
    }
}

export function createSliceWrap<T extends BaseReduxWrapper>(obj: T) {
  const ownProperties = Object.getOwnPropertyNames(obj);
  const that: typedef = obj as unknown as typedef;
  const functions = ownProperties.filter((property) =>
    typeof that[property] === 'function' &&
      property !== 'constructor' &&
      that[property].__UNSAFE_REDUCER)
    .reduce((el, d) => {
      // @ts-ignore
      el[d] = that[d] as Function;
      return el;
    }, {});
  obj.__FUNS__ = functions;
  console.log(functions, ownProperties, Object.getOwnPropertyNames(obj));
  const slice = createSlice({
    name: obj.name,
    initialState: obj.initialState,
    reducers: {
      ...functions,
    },
  });
  if (!obj.__VALUE__) {
    obj.__VALUE__ = slice;
  }
  return slice;
}

export function ReduxFactory(name: string): any {
  return (target: any) => {
    if (target === void 0) {
      throw new Error('this is not factory!');
    }
    target.prototype.__UNSAFE_REDUX_FACTORY = {
      IS_REDUX_WRAPPED: true,
      NAMING: name,
    };
  };
}

export function ReduxMethod(target: any, key: string, descriptor: PropertyDescriptor): any {
  if (target === void 0) {
    throw new Error('this controller is not correct!');
  }
  const originalValue = target[key];
  descriptor.value = function (state: any, action: any) {
    console.log('1234');
    originalValue(state, action);
  };
  descriptor.value.__UNSAFE_REDUCER = true;
}

export function ReduxThunk(target: any, key: string, descriptor: PropertyDescriptor) {
  if (target === void 0) {
    throw new Error('this controller is not correct!');
  }
  const originalValue = descriptor.value;
  const vv = target.__VALUE___;
  if (!vv) {
    createSliceWrap(target);
  }
  const actions = target.__VALUE__.actions;
  descriptor.value = (data: any) => function (dispatch: any) {
    originalValue(dispatch, actions, data);
  };
  descriptor.value.__UNSAFE_THUNK = true;
}
