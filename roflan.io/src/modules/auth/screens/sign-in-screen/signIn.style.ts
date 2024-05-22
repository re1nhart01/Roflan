import styled from 'styled-components/native';
import { Screen } from '@components/atoms/screen/Screen.tsx';
import { theme } from 'native-base';
import { ButtonComponent } from '@components/atoms/button/Button.tsx';

export const signInStyle = {
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
  QRCode: styled.Image`
    width: 300px;
    height: 300px;
    margin-bottom: 20px;
  `,
  BoxQr: styled.View`
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  `,
  CodeBox: styled.View`
    border-radius: 8px;
    margin-top: 20px;
    background-color: ${theme.colors.primary['900']};
    padding: 20px 40px;
  `,
};
