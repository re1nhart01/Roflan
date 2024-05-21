import { StyleSheet } from 'react-native';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@core/constants/defaults.ts';

export default StyleSheet.create({
  SafeArea: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    flex: 1,
  },
});
