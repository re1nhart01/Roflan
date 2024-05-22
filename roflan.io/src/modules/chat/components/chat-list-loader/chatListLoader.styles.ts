import styled from 'styled-components/native';
import { theme } from 'native-base';

export const chatListLoaderStyles = {
  Wrapper: styled.View`
    width: 100%;
    height: 40px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-top: 30px;
  `,
  ActivityLoader: styled.ActivityIndicator.attrs({
    size: 36,
    color: theme.colors.primary['900'],
  })``,
  EmptyView: styled.View``,
};
