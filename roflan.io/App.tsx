import React, { useEffect } from 'react';
import {
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

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const state = useSelector(state => state);
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

    </SafeAreaView>
  );
}

export default App;
