import { AppRegistry } from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@core/redux-class';
import { name as appName } from './app.json';
import App from './App';

const AppWithContainerStore = () => {
  console.log(store);
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

AppRegistry.registerRunnable(appName, async (initialState) => {
  try {
    AppRegistry.registerComponent(appName, () => AppWithContainerStore);
    AppRegistry.runApplication(appName, initialState);
  } catch (e) {
    console.log('registerRunnable ex', e);
    AppRegistry.registerComponent(appName, () => AppWithContainerStore);
    AppRegistry.runApplication(appName, initialState);
  }
});
