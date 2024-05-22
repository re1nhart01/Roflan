import { useHeaderHeight } from '@react-navigation/elements';
import type { FC, RefObject } from 'react';
import React, { memo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { InteractionManager } from 'react-native';

import { DEVICE_HEIGHT } from '@core/constants/defaults.ts';
import { EmptyScreen } from '@components/molecules/empty-screen/EmptyScreen.tsx';
import { Localization } from '@core/constants/localization.ts';
import type { ChatDataTypeUnion } from '../../helpers/types';
import { MESSAGES_PER_PAGE } from '../../helpers/types';
import type { ChatMessageType } from '../../store/chat.store.types';
import ChatListLoader from '../chat-list-loader/ChatListLoader';
import type { chatScrollButtonForwardProps } from '../chat-scroll-button/ChatScrollButton';
import ChatScrollButton from '../chat-scroll-button/ChatScrollButton';
import ChatEntityView from '../message-views/ChatEntityView';
import { chatListViewStyles } from './chatListView.styles';

const { FlashListViewWrapper, ChatFlashList } = chatListViewStyles;

type chatListViewProps = {
  data: ChatDataTypeUnion[];
  requestId: string | number;
  myUserId: string;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  onScrollTopReached: () => Promise<void>;
  scrollListRef: RefObject<FlatList<ChatDataTypeUnion>>;
  chatButtonRef: RefObject<chatScrollButtonForwardProps>;
};

const TRIGGER_PERCENT = 14;

const ChatListView: FC<chatListViewProps> = ({
  data,
  requestId,
  myUserId,
  isLoading,
  onScrollTopReached,
  scrollListRef,
  chatButtonRef,
}) => {
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const isNotTriggered = useRef<boolean>(false);
  const keyExtractor = (
    item: ChatDataTypeUnion | ChatMessageType,
    index: number,
  ) => {
    if ('sender' in item) {
      return `__message__${item.sender.user.id}_${item.id}_${item.topicId}__${index}`;
    }
    return `${item.id}`;
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ChatDataTypeUnion; index: number }) => (
      <ChatEntityView myUserId={myUserId} data={item} index={index} />
    ),
    [myUserId],
  );

  const handleOnPressChatListButton = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      scrollListRef.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
    });
  }, [scrollListRef]);

  const handleOnShowChatButton = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      chatButtonRef.current?.onChangeVisible(
        contentOffset.y >= DEVICE_HEIGHT / 2,
      );
    },
    [chatButtonRef],
  );

  // fires when reach inverted top of list
  const handleOnTopReached = useCallback(
    async ({
      nativeEvent: { layoutMeasurement, contentOffset, contentSize },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollPercent = Math.round(
        (contentOffset.y / (contentSize.height - layoutMeasurement.height)) *
          100,
      );
      if (currentScrollPercent <= TRIGGER_PERCENT && !isNotTriggered.current) {
        isNotTriggered.current = true;
      } else if (currentScrollPercent >= TRIGGER_PERCENT) {
        isNotTriggered.current = false;
      }
    },
    [],
  );

  const handleOnScrollEvent = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      handleOnTopReached?.(event);
      handleOnShowChatButton(event);
    },
    [handleOnShowChatButton, handleOnTopReached],
  );

  const handleScrollEndReached = useCallback(() => {
    onScrollTopReached?.();
  }, [onScrollTopReached]);

  return (
    <FlashListViewWrapper headerHeight={headerHeight}>
      <ChatScrollButton
        onPress={handleOnPressChatListButton}
        ref={chatButtonRef}
      />
      <ChatFlashList
        scrollEnabled
        bounces
        inverted
        ref={scrollListRef}
        nestedScrollEnabled={false}
        data={data}
        onEndReached={handleScrollEndReached}
        onScroll={handleOnScrollEvent}
        extraData={requestId}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={(
          <EmptyScreen
            inverted
            iconType="noInternet"
            Img={require('@assets/png/no-message.png')}
            text={Localization.components.no_messages_yet}
            marginTop={DEVICE_HEIGHT / 3.5}
          />
        )}
        ListFooterComponent={<ChatListLoader visible={isLoading} />}
        decelerationRate={0.84}
        onEndReachedThreshold={0.4}
        needsOffscreenAlphaCompositing={false}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        scrollEventThrottle={700}
        removeClippedSubviews={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: MESSAGES_PER_PAGE,
        }}
        viewabilityConfig={{
          waitForInteraction: false,
          itemVisiblePercentThreshold: 100,
          viewAreaCoveragePercentThreshold: 100,
        }}
      />
    </FlashListViewWrapper>
  );
};

export default memo(ChatListView);
