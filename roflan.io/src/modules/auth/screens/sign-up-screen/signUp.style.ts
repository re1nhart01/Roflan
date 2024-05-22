import styled from 'styled-components/native';
import { Screen } from '@components/atoms/screen/Screen.tsx';
import { theme } from 'native-base';
import {ButtonComponent} from "@components/atoms/button/Button.tsx";

export const signUpStyle = {
  Wrapper: styled(Screen)`
    background-color: ${theme.colors.white};
  `,
  Text: styled.Text``,
  ButtonStyle: styled(ButtonComponent)`
    background-color: #007bff;
    border-radius: 16px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 14px;
    padding-bottom: 14px;
  `,
};
