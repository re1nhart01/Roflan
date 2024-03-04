import { configureStore } from '@reduxjs/toolkit';
import { UserStore } from '@core/redux-class/UserStore.ts';
import { createSliceWrap } from '@core/redux-class/BaseReduxWrapper.ts';

const userStore = new UserStore();
createSliceWrap(userStore);

export const userThunks = userStore.__C__();
console.log(userThunks);
export const store = configureStore({
  reducer: userStore.__VALUE__?.reducer!,
});

export const actions2 = userStore.__VALUE__?.actions!;