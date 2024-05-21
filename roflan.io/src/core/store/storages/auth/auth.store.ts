import { action } from 'easy-peasy';
import { IAuthStore } from './auth.store.type';

export const authStore: IAuthStore = {
  isAuth: false,
  setIsAuth: action((state, payload) => {
    state.isAuth = payload;
  }),
};
