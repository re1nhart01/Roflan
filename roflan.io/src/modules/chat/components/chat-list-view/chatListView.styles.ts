import { defaultTo } from 'ramda';
import styled from 'styled-components/native';

import { FlatList, FlatListProps } from 'react-native';
import { DEVICE_HEIGHT } from '@core/constants/defaults.ts';
import { theme } from 'native-base';
import type { ChatDataTypeUnion } from '../../helpers/types';
import { INPUT_HEIGHT } from '../../helpers/types';

export const chatListViewStyles = {
  FlashListViewWrapper: styled.View<{ headerHeight?: number }>`
    width: 100%;
    height: ${DEVICE_HEIGHT};
    flex: 1;
    top: 30px;
    background-color: ${theme.colors.dark['800']};
    border: 1px solid ${theme.colors.dark['600']};
    border-top-color: ${theme.colors.dark['500']};
    padding-bottom: ${INPUT_HEIGHT}px;
  `,
  ChatFlashList: styled(FlatList<ChatDataTypeUnion>).attrs<
    FlatListProps<ChatDataTypeUnion>
  >(() => ({
    contentContainerStyle: {
      paddingTop: 35,
    },
    ListFooterComponentStyle: {
      paddingBottom: 45,
    },
  }))`
    width: 100%;
    height: 100%;
  `,
};
