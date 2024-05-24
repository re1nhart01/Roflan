import styled from 'styled-components/native';
import { Screen } from '@components/atoms/screen/Screen.tsx';
import { theme } from 'native-base';

export const chatDMStyles = {
  Wrapper: styled(Screen).attrs({
    overrideEdges: ['right', 'left'],
  })`
    width: 100%;
    flex: 1;
    background-color: ${theme.colors.darkBlue['800']};
  `,
  KeyboardAvoidingView: styled.KeyboardAvoidingView`
    width: 100%;
    flex: 1;
  `,
};
