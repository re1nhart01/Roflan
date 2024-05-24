import styled from 'styled-components/native';
import { theme } from 'native-base';
import {ButtonComponent} from "@components/atoms/button/Button.tsx";

export const preferencesCommonStyles = {
  CodeBox: styled.View`
    border-radius: 8px;
    margin-top: 20px;
    background-color: ${theme.colors.primary['900']};
    padding: 20px 40px;
  `,
  ButtonStyle: styled(ButtonComponent)`
    background-color: #007bff;
    border-radius: 16px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 14px;
    padding-bottom: 14px;
  `,
};
