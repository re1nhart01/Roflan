import { action } from 'easy-peasy';
import { filteredFromActionsModel } from '@core/helpers/functions.ts';
import { IUserStore } from './user.store.type';

export const userStore: IUserStore = {
  reset: action((state) => {
    const filteredNewsModel = filteredFromActionsModel(userStore);
    Object.assign(state, filteredNewsModel);
  }),
};
