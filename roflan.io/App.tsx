import React, { useEffect } from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { RootRoutes } from '@src/modules/navigation/screens/RootRoutes.tsx';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@core/constants/defaults.ts';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import appStyle from './app.style.ts';

const { SafeArea } = appStyle;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
  }, []);

  return (
    <NavigationContainer>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <SafeAreaView style={SafeArea}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />
            <RootRoutes />
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}

export default App;
