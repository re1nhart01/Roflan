import type { StyleProp, TextInput, TextStyle } from 'react-native';
import styled from 'styled-components/native';
import React from 'react';

export const OTPInputViewStyles = {
  FullWidthPressableContainer: styled.Pressable`
    width: 100%;
  `,
  TouchableInputInnerContainer: styled.Pressable`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  `,
  DefaultTextFieldOTP: styled.TextInput.attrs({
    keyboardType: 'number-pad',
    underlineColorAndroid: 'rgba(0,0,0,0)',
  })<{
    isSelected: boolean;
    codeInputFieldStyle: StyleProp<TextStyle>;
    codeInputHighlightStyle: StyleProp<TextStyle>;
  }>`
    width: 45px;
    height: 45px;
    font-size: 16px;
    text-align: center;
    color: rgba(226, 226, 226, 1);
    ${({ isSelected, codeInputFieldStyle, codeInputHighlightStyle }) =>
    (isSelected
      ? ([codeInputFieldStyle, codeInputHighlightStyle] as never)
      : ([codeInputFieldStyle] as never))}
  `,
  HiddenTextField: styled.TextInput<{ ref?: React.MutableRefObject<TextInput> }>`
    position: absolute;
    width: 0px;
    height: 0px;
  `,
  InnerField: styled.View`
    border-color: #fff;
    border-width: 2px;
    text-align: center;
  `,
};
