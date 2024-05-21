import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import { theme } from 'native-base';

export const animatedInputStyles = {
  Wrapper: styled.View`
    border-bottom-width: 1px;
    border-color: ${theme.colors.black};
    flex-direction: row;
    justify-content: space-between;
  `,
  TextInput: styled.TextInput<{ maxHeight?: number }>`
    min-height: 40px;
    width: 90%;
    max-height: 60px;
    font-size: 14px;
    color: #ffffff;
    line-height: 24px;
    padding-bottom: 8px;
  `,
  RightContainer: styled.TouchableOpacity.attrs({
    activeOpacity: 1,
    hitSlop: { bottom: 32, top: 32, left: 32, right: 32 },
  })`
    justify-content: center;
    align-items: center;
    margin-right: 5px;
  `,
  PlaceholderText: styled.Text`
    font-size: 24px;
    font-weight: 300;
    color: ${theme.colors.white};
    line-height: 24px;
  `,
  AnimatedContainer: styled(Animated.View)<{ topValue: number }>`
    position: absolute;
    padding-left: 3px;
  `,
};
