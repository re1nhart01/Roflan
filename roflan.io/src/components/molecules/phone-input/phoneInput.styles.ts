import styled from 'styled-components/native';
import { theme } from 'native-base';

export const PhoneInputStyles = {
  Wrapper: styled.Pressable.attrs({
    hitSlop: {
      left: 90,
      top: 90,
      right: 90,
      bottom: 90,
    },
  })`
    flex-direction: row;
    align-items: center;
    height: 48px;
  `,
  PhoneText: styled.Text`
    line-height: 28px;
    font-size: 22px;
    font-weight: 500;
    color: ${theme.colors.darkText};
  `,
  PhoneTextInput: styled.TextInput.attrs({
    textAlignVertical: 'bottom',
  })`
    width: auto;
    height: 100%;
    padding: 9px 12px;
    font-size: 22px;
    color: ${theme.colors.secondary['100']};
  `,
};
