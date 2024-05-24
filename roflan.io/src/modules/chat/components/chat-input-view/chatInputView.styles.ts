import type { TextInputProps, TouchableOpacityProps } from 'react-native';
import styled from 'styled-components/native';

import { ChevronRightIcon, theme } from 'native-base';
import { INPUT_HEIGHT } from '../../helpers/types';

export const chatInputViewStyles = {
  Wrapper: styled.View`
    width: 100%;
    min-height: ${INPUT_HEIGHT}px;
    max-height: 165px;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    background-color: ${theme.colors.dark['900']};
    border: 1px solid ${theme.colors.dark['600']};
    border-top-color: ${theme.colors.dark['500']};
  `,
  ActionsRow: styled.View`
    flex-direction: row;
    align-items: center;
    padding-left: 16px;
  `,
  MessageInput: styled.TextInput.attrs<TextInputProps>({
    placeholderTextColor: theme.colors.gray['400'],
  })`
    flex: 1;
    padding-top: 10px;
    max-height: 144px;
    min-height: 48px;
    margin-right: 8px;
    background-color: ${theme.colors.dark['900']};
    font-size: 20px;
    color: ${theme.colors.black};
    line-height: 24px;
    margin-bottom: 5px;
  `,
  ButtonView: styled.TouchableOpacity.attrs<TouchableOpacityProps>({
    activeOpacity: 1,
    hitSlop: { bottom: 25, top: 25, left: 20, right: 20 },
  })`
    opacity: ${({ disabled }) =>
    (disabled ? theme.opacity['40'] : theme.opacity['100'])};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-right: 26px;
  `,
  ChatButtonIcon: styled(ChevronRightIcon).attrs({
    size: 20,
  })``,
  Spacer: styled.View<{ height: number }>`
    width: 100%;
    background-color: #fff;
    height: ${({ height }) => height}px;
  `,
};
