import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

import { Button, ChevronDownIcon, theme } from 'native-base';

export const chatScrollButtonStyles = {
  ButtonAnimatedContainer: styled(Animated.View)`
    position: absolute;
    right: 15px;
    bottom: 0px;
    width: 60px;
    height: 60px;
    z-index: 999;
  `,
  ButtonWrapper: styled(Button)`
    width: 100%;
    position: relative;
    height: 100%;
    border-radius: 300px;
    background-color: ${theme.colors.dark['900']};
    border: ${theme.colors.dark['800']};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  ButtonIcon: ChevronDownIcon,
  ButtonNewMessageWrapper: styled.View`
    position: absolute;
    top: -10px;
    left: 0;
    border-radius: 50px;
    background-color: ${({ theme }) => theme.colors.lightGreen};
    z-index: 999;
    min-width: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  ButtonNewMessagesText: styled.Text`
    font-size: 12px;
    font-weight: 400;
    color: ${theme.colors.white};
    line-height: 12;
    margin-bottom: 6px;
    margin-top: 6px;
  `,
};
