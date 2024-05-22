import styled from 'styled-components/native';
import { Screen } from '@components/atoms/screen/Screen.tsx';
import { theme } from 'native-base';

export const welcomeScreenStyle = {
  Wrapper: styled(Screen)`
    flex: 1;
    background-color: ${theme.colors.white};
  `,
  Text: styled.Text``,
};
