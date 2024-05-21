import { store } from '@core/redux-class';
import { createSliceWrap } from '@core/redux-class/base/functions.ts';
import {Dispatch} from "@reduxjs/toolkit";

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

export function ReduxThunk<T>(target: any, key: string, descriptor: PropertyDescriptor) {
  if (target === void 0) {
    throw new Error('this controller is not correct!');
  }
  const originalValue = descriptor.value;
  const vv = target.internalValue;
  if (!vv) {
    createSliceWrap(target);
  }
  const actions = target.internalValue.actions;
  descriptor.value = (data: T) => function (dispatch: Dispatch) {
    originalValue(dispatch, actions, data, store);
  };
  descriptor.value.__UNSAFE_THUNK = true;
}
