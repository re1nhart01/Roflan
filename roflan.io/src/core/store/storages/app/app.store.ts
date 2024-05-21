import { action } from 'easy-peasy';
import { IAppStore } from './app.store.type';

export const appStore: IAppStore = {
  isNetworkError: false,
  setIsNetworkError: action((state, payload) => {
    state.isNetworkError = payload;
  }),
  isLoad: false,
  setIsLoad: action((state, payload) => {
    state.isLoad = payload;
  }),
};
