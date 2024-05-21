import {Animated, StyleSheet} from 'react-native';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@core/constants/defaults.ts';
import { theme } from 'native-base';
import styled from 'styled-components/native';
import Video from 'react-native-video';

export const LoaderStyle = {
  Wrapper: styled(Animated.View)`
    position: absolute;
    left: 0;
    top: 0;
    width: ${DEVICE_WIDTH}px;
    height: ${DEVICE_HEIGHT}px;
    background-color: ${theme.colors.black};
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  LoaderGif: styled(Video)`
    width: 400px;
    height: 400px;
    border-radius: 999px;
    border-width: 4px;
    border-color: ${theme.colors.white};
  `,
};
