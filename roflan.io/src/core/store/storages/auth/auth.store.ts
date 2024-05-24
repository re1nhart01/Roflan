import { Actions, action, thunk } from 'easy-peasy';
import { requester } from '@core/http/requester.ts';
import { Modules } from '@core/http/misc.ts';
import axios from 'axios';
import { InvalidResponseHandler, handler } from '@core/http/respo.ts';
import { handleUnexpectedError } from '@core/store/helpers/functions.ts';
import NativeMainModule from '@tm/NativeMainModule.ts';
import { BaseRequest, RefreshTokenResponse } from '@type/definitions.ts';
import { tokensCacheStore } from '@core/caching';
import { filteredFromActionsModel } from '@core/helpers/functions.ts';
import { StoreModel } from '@core/store/store.type.ts';
import { IAuthStore } from './auth.store.type';

export const authStore: IAuthStore = {
  isAuth: false,
  setIsAuth: action((state, payload) => {
    state.isAuth = payload;
  }),
  loginUser: thunk(async (actions, payload, helpers) => {
    try {
      await requester(`${Modules.auth}/log-in`, 'POST', {}, payload, false);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw new InvalidResponseHandler(e?.response as unknown as handler);
      }
      await handleUnexpectedError();
      console.log(4);
      throw new Error('loginUser abort');
    }
  }),
  registerUser: thunk(async (actions, payload, helpers) => {
    try {
      await requester(`${Modules.auth}/sign-in`, 'POST', {}, payload, false);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw new InvalidResponseHandler(e?.response as unknown as handler);
      }
      await handleUnexpectedError();
      throw new Error('loginUser abort');
    }
  }),
  validateCode: thunk(async (actions, payload, helpers) => {
    try {
      const response = await requester<BaseRequest<RefreshTokenResponse>>(`${Modules.auth}/verify`, 'POST', {
        'client-secret': NativeMainModule.getEnv('CLIENT_KEY'),
        'client-value': NativeMainModule.getEnv('CLIENT_VALUE'),
      }, payload, false);
      if (response.data.response) await tokensCacheStore.getAndSetTokenData(response.data.response);
      actions.setIsAuth(true);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw new InvalidResponseHandler(e?.response as unknown as handler);
      }
      await handleUnexpectedError();
      console.log(4);
      throw new Error('loginUser abort');
    }
  }),
  logout: thunk(async (actions, _, helpers) => {
    try {
      const storeActions = helpers.getStoreActions() as Actions<StoreModel>;
      await tokensCacheStore.destroy();
      actions.reset();
      storeActions.user.reset();
      storeActions.chats.reset();
      actions.setIsAuth(false);
    } catch (e) {
      console.warn('logout ex');
    }
  }),
  reset: action((state) => {
    const filteredNewsModel = filteredFromActionsModel(authStore);
    Object.assign(state, filteredNewsModel);
  }),
};
