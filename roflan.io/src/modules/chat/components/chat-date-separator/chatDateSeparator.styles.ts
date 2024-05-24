import styled from 'styled-components/native';
import { theme } from 'native-base';

export const chatDateSeparatorStyles = {
  Container: styled.View`
    width: 100%;
    height: 24px;
    background-color: transparent;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  `,
  Wrapper: styled.View`
    border-radius: 8px;
    display: flex;
    padding: 6px;
    align-self: flex-start;
    background-color: ${theme.colors.primary['300']};
  `,
  Text: styled.Text`
    font-size: 12px;
    font-weight: 300;
    color: ${theme.colors.secondary['300']};
    line-height: 12px;
  `,
};
