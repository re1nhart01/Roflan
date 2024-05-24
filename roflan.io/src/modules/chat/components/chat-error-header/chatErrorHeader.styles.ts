import styled from 'styled-components/native';

import { theme } from 'native-base';

export const chatErrorHeaderStyles = {
  Wrapper: styled.View<{ headerHeight: number }>`
    position: absolute;
    top: ${({ headerHeight }) => headerHeight}px;
    width: 100%;
    background-color: ${theme.colors.tertiary['300']};
    z-index: 999;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  ErrorMessage: styled.Text`
    font-size: 8px;
    font-weight: 300;
    color: ${theme.colors.primary['300']};
    margin-left: 20px;
    text-align: center;
    line-height: 28px;
  `,
};
