import { action, thunk } from 'easy-peasy';
import { filteredFromActionsModel } from '@core/helpers/functions.ts';
import { requester } from '@core/http/requester.ts';
import { Modules } from '@core/http/misc.ts';
import axios from 'axios';
import { InvalidResponseHandler, handler } from '@core/http/respo.ts';
import { handleUnexpectedError } from '@core/store/helpers/functions.ts';
import NativeMainModule from '@tm/NativeMainModule.ts';
import { UserModelMe } from '@type/models.ts';
import { BasePaginatorResponse, BaseRequest } from '@type/definitions.ts';
import { IUserStore } from './user.store.type';

export const userStore: IUserStore = {
  userList: [],
  updatableUserData: null,
  userData: null,
  setUserList: action((state, payload) => {
    state.userList = payload;
  }),
  setUpdatableUserData: action((state, payload) => {
    state.updatableUserData = payload;
  }),
  setUserData: action((state, payload) => {
    state.userData = payload;
  }),
  getMe: thunk(async (actions, payload, helpers) => {
    try {
      const { data } = await requester<BaseRequest<UserModelMe>>(`${Modules.user}/me`, 'GET', {
        'client-secret': NativeMainModule.getEnv('CLIENT_KEY'),
        'client-value': NativeMainModule.getEnv('CLIENT_VALUE'),
      }, void 0, true);
      if (data.response) {
        actions.setUpdatableUserData(data.response);
        actions.setUserData(data.response);
      }
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        throw new InvalidResponseHandler(e?.response as unknown as handler);
      }
      await handleUnexpectedError();
      throw new Error('loginUser abort');
    }
  }),
  getUsersToCreateChat: thunk(async (actions, payload, helpers) => {
    try {
      const { data } = await requester<BasePaginatorResponse<UserModelMe>>(`${Modules.user}?page=0&limit=40`, 'GET', {
        'client-secret': NativeMainModule.getEnv('CLIENT_KEY'),
        'client-value': NativeMainModule.getEnv('CLIENT_VALUE'),
      }, void 0, true);
      if (data.data) {
        actions.setUserList(data.data);
      }
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        throw new InvalidResponseHandler(e?.response as unknown as handler);
      }
      await handleUnexpectedError();
      throw new Error('loginUser abort');
    }
  }),
  updateUserFields: thunk(async (actions, payload, helpers) => {
    try {
      const { data } = await requester<BaseRequest<UserModelMe>>(`${Modules.user}/me`, 'PATCH', {
        'client-secret': NativeMainModule.getEnv('CLIENT_KEY'),
        'client-value': NativeMainModule.getEnv('CLIENT_VALUE'),
      }, payload, true);
      if (data.response) {
        actions.setUpdatableUserData(data.response);
        actions.setUserData(data.response);
      }
      return data?.response;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw new InvalidResponseHandler(e?.response as unknown as handler);
      }
      await handleUnexpectedError();
      throw new Error('loginUser abort');
    }
  }),
  reset: action((state) => {
    const filteredNewsModel = filteredFromActionsModel(userStore);
    Object.assign(state, filteredNewsModel);
  }),
};
