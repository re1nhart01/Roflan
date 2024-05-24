import { defaultTo } from 'ramda';
import styled from 'styled-components/native';

import { FlatList, FlatListProps } from 'react-native';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from '@core/constants/defaults.ts';
import { theme } from 'native-base';
import type { ChatDataTypeUnion } from '../../helpers/types';
import { INPUT_HEIGHT } from '../../helpers/types';

export const chatListViewStyles = {
  FlashListViewWrapper: styled.View<{ headerHeight?: number }>`
    width: ${DEVICE_WIDTH};
    height: ${DEVICE_HEIGHT};
    flex: 1;
    background-color: ${theme.colors.darkBlue['900']};
    border: 1px solid ${theme.colors.dark['600']};
    border-top-color: ${theme.colors.dark['500']};
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
    width: ${DEVICE_WIDTH};
    height: ${DEVICE_HEIGHT};
  `,
};
