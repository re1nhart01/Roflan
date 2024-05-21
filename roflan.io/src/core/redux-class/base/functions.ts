import { createSlice } from '@reduxjs/toolkit';
import { Wrapper } from '@core/redux-class/base/wrapper.ts';
import { typedef } from '@core/redux-class/base/index';

export function createSliceWrap<T extends Wrapper>(obj: T) {
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
  const slice = createSlice({
    name: obj.name,
    initialState: obj.initialState,
    reducers: {
      ...functions,
    },
  });
  if (!obj.internalValue) {
    obj.internalValue = slice;
  }
  return { slice, obj };
}

export function grabReducers<T extends Wrapper>(v: { obj: T }) {
  return v.obj?.internalValue!.reducer;
}

export function grabActions<T extends Wrapper>(v: { obj: T }) {
  return v.obj?.internalValue!.actions;
}
