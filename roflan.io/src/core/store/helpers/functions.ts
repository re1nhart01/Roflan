import { Alert } from 'react-native';
import { store } from '@core/store/store.ts';

export const handleApplicationLogout = async () => {

};

export const handleUnexpectedError = async () => {
  const storeActions = store.getActions();
  storeActions.app.setIsNetworkError(true);
  Alert.alert('Error!', 'Unexpected error was happend, if it will be repeats, write to eugene.kokaiko@gmail.com');
};
