import { Wrapper } from '@core/redux-class/base/wrapper.ts';
import { Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';

export type FunctionNames<T> = {
    [K in keyof T]: T[K] extends Function ? ((...args: never) => void) : never;
}[keyof T];

type TransformedFunctions<T, NewReturnType> = {
    [P in FunctionNames<T>]: (...args: Parameters<T[P]>) => NewReturnType;
};

type DispatchActionMethods<T> = {
    [P in keyof T]: T[P] extends (...args: any[]) => any ? ((payload: any) => UnknownAction) : never;
};

export type reduxthunkdef<T, STORE extends Wrapper> = (state: Pick<STORE, 'initialState'>, actions: Pick<STORE, FunctionNames<STORE>>, store: { a: 454 }) => Promise<void>;
export type typedef = { [key: string]: { [key: string]: unknown } };

export type RRState<STORE extends Wrapper> = { [key in keyof STORE['initialState']]: STORE['initialState'][key] };
export type RRActions<STORE extends Wrapper> = DispatchActionMethods<STORE>;
export type RRStore<STORE extends Wrapper> = { a: 545 };

export type RAction<T extends { [key: string]: unknown }, S> = (state: S, payload: PayloadAction<T>) => void
export type RThunk<P, T, R> = (dispatch: Dispatch, actions: RRActions<T>, data: P) => Promise<R>;
export type RState<T extends { [key: string]: unknown }> = T;
export type ThunkSh<P, T> = (v: P) => (dispatch: Dispatch) => Dispatch;
