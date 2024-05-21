import { StatusBar, StyleSheet } from 'react-native';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@core/constants/defaults.ts';

export default StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'yellow',
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    paddingTop: StatusBar.currentHeight,
  },
});
