import React, { useEffect } from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { useDispatch, useSelector } from 'react-redux';
import { userThunks } from '@core/redux-class';
import NativeSampleModule from '@tm/NativeSampleModule.ts';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    dispatch(userThunks.aba({ negg: 'adsdasd' }));
  }, []);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Button onPress={() => setTimeout(() => { NativeSampleModule?.getString() }, 4000)} title="asdasas"></Button>
    </SafeAreaView>
  );
}

export default App;
