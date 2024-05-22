import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { defaultTo, isNil } from 'ramda';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, InteractionManager } from 'react-native';
import { Routes } from '@src/modules/navigation/helpers/Routes.ts';
import { useStoreActions, useStoreState } from '@core/store/store.ts';
import {
  chatScrollButtonForwardProps,
} from '@src/modules/chat/components/chat-scroll-button/ChatScrollButton.tsx';
import { ChatDataTypeUnion } from '@src/modules/chat/helpers/types.ts';
import { useChatEmitter } from '@src/modules/chat/helpers/hooks/useChatEmitter.ts';
import { getMessagingURL } from '@src/modules/chat/helpers/functions.ts';
import { useWebsocket } from '@core/hooks/useWebsocket.ts';
import { tokensCacheStore } from '@core/caching';

export const useChatDMState = () => {
  // const {
  //   params: {  },
  // } = useRoute<Route<string, RootStackParams[Routes.ChatDM]>>();
  const {
    // common: { setIsGlobalLoading },
    // chats: {
    //   getMessageList,
    //   addDummyMessage,
    //   cleanMessageList,
    //   getFirstMessageId,
    //   getUnreadMessagesCounter,
    //   getTopics,
    // },
  } = useStoreActions((state) => state);
  const {
    // chats: { messagesList, totalPages },
    // profile: { userProfile },
  } = useStoreState((state) => state);

  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const myUserId = useMemo(() => defaultTo('', userProfile?.id), [userProfile]);
  const currentPage = useRef<number>(1);
  const scrollListRef = useRef<FlatList<ChatDataTypeUnion>>(null);
  const chatButtonRef = useRef<chatScrollButtonForwardProps>(null);
  const isInitialLoad = useRef<boolean>(true);

  const { onMessage, ...emitter } = useChatEmitter(myUserId);
  const chatURL = getMessagingURL(topicId);
  const { connect, closeSocket, timerId, transferData, isConnect } =
    useWebsocket(
      getMessagingURL.bind(
        this,
        topicId,
        tokensCacheStore.currentState.access_token,
      ),
      {
        ...emitter,
        onMessage: async (evt) => {
          await onMessage?.(evt as any, transferData);
          chatButtonRef.current?.updateCounter();
        },
      },
    );

  const goToChatAttachments = useCallback(() => {
    navigation.navigate(Routes.VerifyScreen);
  }, [navigation, requestId, topicId]);

  const onSendMessage = useCallback(
    async (value: string) => {
      const lastMessage = messagesList[0] as ChatMessageType;
      if (isNil(topicId) || isNil(userProfile)) return;
      const newMessage = createMessage(
        value,
        defaultTo(0, lastMessage?.id),
        ChatDataType.text,
        [],
        topicId,
        userProfile.id,
      );
      addDummyMessage(newMessage);
      const transferMsg = createTransferMessage(ChatDataType.text, value);
      await transferData(transferMsg);

      InteractionManager.runAfterInteractions(() => {
        scrollListRef.current?.scrollToOffset({
          animated: true,
          offset: 0,
        });
      });
    },
    [messagesList, topicId, userProfile, addDummyMessage, transferData],
  );

  const onChatLoad = useCallback(async () => {
    try {
      if (!isNil(topicId)) {
        await Promise.all([
          KeyboardModeNative.executeModule('updateMode', [
            SoftInputMode.RESIZE,
          ]),
          getMessageList({
            topicId,
            page: 1,
            itemsPerPage: MESSAGES_PER_PAGE,
          }),
        ]);
        await connect();
        if (isValidStatus) {
          // logic to fire seen event
          const lastMsgId = getFirstMessageId();
          !isNil(lastMsgId) &&
            (await transferData(
              createTransferMessage(ChatDataType.seen, `${lastMsgId}`),
            ));
        }
      }
    } catch (e) {
      sentrySendCustomEvent(
        SENTRY_CUSTOM_EVENTS_MESSAGES.onChatLoadError,
        'error',
        {
          now: Date.now(),
          topicId,
          requestId,
          chatURL: await chatURL,
          errorMsg: e?.toString(),
        },
      );
    } finally {
      InteractionManager.runAfterInteractions(() => {
        setIsGlobalLoading(false);
      });
      isInitialLoad.current = false;
      await Promise.allSettled([getUnreadMessagesCounter(), getTopics()]);
    }
  }, [
    chatURL,
    connect,
    getFirstMessageId,
    getMessageList,
    getTopics,
    getUnreadMessagesCounter,
    isValidStatus,
    requestId,
    sentrySendCustomEvent,
    setIsGlobalLoading,
    topicId,
    transferData,
  ]);

  const onScrollTopReached = useCallback(async () => {
    const currPage = currentPage.current;
    try {
      if (
        !isInitialLoad.current &&
        currPage + 1 <= totalPages &&
        !isNil(topicId)
      ) {
        setIsLoading(true);
        await getMessageList({
          topicId,
          page: currPage + 1,
          itemsPerPage: MESSAGES_PER_PAGE,
        });
        currentPage.current += 1;
      }
    } catch (e) {
      console.log('onScrollTopReached ex', e);
    } finally {
      InteractionManager.runAfterInteractions(() => {
        setIsLoading(false);
      });
    }
  }, [getMessageList, topicId, totalPages]);

  useCustomBackHandler();

  useFocusEffect(
    useCallback(() => {
      setIsGlobalLoading(true);
      onChatLoad().then();
      return () => {
        closeSocket();
        cleanMessageList();
        currentPage.current = 1;
        KeyboardModeNative.executeModule('updateMode', [
          SoftInputMode.PAN,
        ]).then();
        if (!isNil(timerId.current)) clearTimeout(timerId.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRequestHeader({
        currentText: t(localization.chats.request_chat),
        currentHeaderTitle: `№ ${requestId}`,
        HeaderRight: CustomHeaderButton.bind(this, {
          onClickCustom: goToChatAttachments,
          iconKey: 'attachment',
          disabled: true,
        }),
        navigateBackCustom: () =>
          goBackFromPush(Routes.ActiveRequest, {
            openedFromPush: true,
            notificationId,
            id: +requestId,
            type: RequestsType.Order,
          }),
      });
    });
  }, [
    goBackFromPush,
    goToChatAttachments,
    notificationId,
    requestId,
    setRequestHeader,
    t,
  ]);

  return {
    requestId,
    messagesList,
    onSendMessage,
    myUserId,
    isLoading,
    setIsLoading,
    currentPage,
    onScrollTopReached,
    scrollListRef,
    chatButtonRef,
    isConnect,
    isValidStatus,
  };
};
