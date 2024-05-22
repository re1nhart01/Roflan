import { defaultTo } from 'ramda';
import styled from 'styled-components/native';
import { theme } from 'native-base';

export const ErrorMessageStyles = {
  ErrorMessageText: styled.Text<{
    marginTop?: number;
    marginBottom?: number;
    alignment?: 'center' | 'left' | 'right';
  }>`
    padding-top: 10px;
    font-size: 12px;
    font-weight: 400;
    color: ${theme.colors.danger['500']};
    text-align: ${({ alignment }) => defaultTo('left', alignment)};
    line-height: 14px;
    margin-top: ${({ marginTop }) => defaultTo(0, marginTop)}px;
    margin-bottom: ${({ marginBottom }) => defaultTo(0, marginBottom)}px;
  `,
};
