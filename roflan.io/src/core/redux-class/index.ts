import { configureStore } from '@reduxjs/toolkit';
import { createSliceWrap, grabActions, grabReducers } from '@core/redux-class/base/functions.ts';
import { UserStore } from '@core/storages/user/user-store.ts';
import { IUserThunks } from '@core/storages/user/user-store.type.ts';

const userStore = createSliceWrap<UserStore>(new UserStore());

export const userThunks = userStore.obj.collect();
export const store = configureStore({
  reducer: grabReducers(userStore),
});

export const actions2 = grabActions(userStore);
