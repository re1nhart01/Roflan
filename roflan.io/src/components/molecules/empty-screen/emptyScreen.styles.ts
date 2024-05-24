import { defaultTo } from 'ramda';
import styled from 'styled-components/native';
import { theme } from 'native-base';

const HEADER_HEIGHT = 44;

export const EmptyScreenStyles = {
  Wrapper: styled.View<{ marginTop?: number; paddingHorizontal?: number }>`
    align-items: center;
    justify-content: center;
    margin-top: ${({ marginTop }) => defaultTo(HEADER_HEIGHT, marginTop)}px;
    padding-left: ${({ paddingHorizontal }) => defaultTo(0, paddingHorizontal)};
    padding-right: ${({ paddingHorizontal }) =>
    defaultTo(0, paddingHorizontal)};
  `,
  Text: styled.Text`
    font-size: 16px;
    font-weight: 400;
    color: ${theme.colors.black};
    margin-top: 28px;
    text-align: center;
    line-height: 26px;
  `,
};
