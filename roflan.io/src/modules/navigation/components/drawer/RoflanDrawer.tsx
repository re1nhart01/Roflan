import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { FlatList, ListRenderItem, View, useWindowDimensions } from 'react-native';
import React, { FC, useCallback } from 'react';
import { TabBar } from '@src/modules/navigation/components/tab-bar/TabBar.tsx';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';
import { roflanDrawerStyle } from '@src/modules/navigation/components/drawer/roflanDrawer.style.ts';
import { UserRow } from '@components/molecules/user-row/UserRow.tsx';
import { Box, Text } from 'native-base';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@core/constants/defaults.ts';
import { defaultTo } from 'ramda';
import { useStoreState } from '@core/store/store.ts';
import { ChatTopicType } from '@core/store/storages/chat/chat.store.types.ts';

const { DrawerWrapper, OuterBox } = roflanDrawerStyle;

export const RoflanDrawer: FC<DrawerContentComponentProps> = (props) => {
  const {
    chats: { topics },
    user: { userData },
  } = useStoreState((state) => state);
  const width = useWindowDimensions().width * 0.3;
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const navigateToChat = useCallback((topic: string) => {
    navigation.navigate(Routes.ChatScreen, { topicId: topic });
  }, [navigation]);

  const renderItem: ListRenderItem<ChatTopicType> = useCallback(({ item, index }) => {
    return (
      <UserRow
        myUserHash={defaultTo('', userData?.user_hash)}
        {...item}
        index={index}
        onPress={() => navigateToChat(item.topic_hash)}
      />
    );
  }, []);

  return (
    <DrawerWrapper horizontal showsVerticalScrollIndicator={false} scrollEnabled={false} {...props}>
      <Box flex={1} bg="darkBlue.900">
        <OuterBox>
          <Box pl="2" pr="60" maxH={DEVICE_HEIGHT} w={`${DEVICE_WIDTH}`} pt="4">
            <FlatList
              data={defaultTo([], topics)}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.id}`}
            />
          </Box>
        </OuterBox>
        <TabBar />
      </Box>
    </DrawerWrapper>
  );
};
