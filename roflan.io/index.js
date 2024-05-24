import { AppRegistry, LogBox, Pressable, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { StoreProvider } from 'easy-peasy';
import { store } from '@core/store/store';
import 'react-native-gesture-handler';
import { NativeBaseProvider } from 'native-base';
import { enableScreens } from 'react-native-screens';
import { name as appName } from './app.json';
import App from './App';

enableScreens(false);

Pressable.defaultProps = {
  ...(Pressable.defaultProps || {}),
  accessible: false,
  focusable: false,
};

TouchableOpacity.defaultProps = {
  ...(TouchableOpacity.defaultProps || {}),
  accessible: false,
  focusable: false,
};

LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
  'All focusable views should report proper accessibility information.',
  'Failed prop type: Invalid props.style key `initial` supplied to `Text`',
]);

const AppWithContainerStore = () => {
  useEffect(() => {

  }, []);

  return (
    <NativeBaseProvider>
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
    </NativeBaseProvider>
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
