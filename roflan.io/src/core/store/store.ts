import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, createTypedHooks, persist } from 'easy-peasy';
import { appStore } from '@core/store/storages/app/app.store.ts';
import { authStore } from '@core/store/storages/auth/auth.store.ts';
import { StoreModel } from './store.type';

const STORE_KEY = 'APPLICATION_STORE';
export const storeModel: StoreModel = {
  app: appStore,
  auth: authStore,
};

export const store = createStore<StoreModel>(
  persist(storeModel, {
    storage: {
      async getItem () {
        const value = await AsyncStorage.getItem(STORE_KEY);
        return JSON.parse(value as string);
      },
      async setItem <T>(key: string, value: T) {
        await AsyncStorage.setItem(STORE_KEY, JSON.stringify(value));
      },
      removeItem: async () => {
        await AsyncStorage.removeItem(STORE_KEY);
      },
    },
    allow: [],
  }),
  {},
);

export const { useStoreActions, useStoreState, useStoreDispatch } =
    createTypedHooks<StoreModel>();
