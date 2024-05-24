import styled from 'styled-components/native';
import { Screen } from '@components/atoms/screen/Screen.tsx';
import { theme } from 'native-base';

export const chatAttachmentsStyles = {
  Wrapper: styled(Screen).attrs({
    overrideEdges: ['right', 'left'],
  })`
    width: 100%;
    flex: 1;
    background-color: ${theme.colors.darkBlue['800']};
  `,
};
