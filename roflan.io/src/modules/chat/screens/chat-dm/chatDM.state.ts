import { NavigationProp, Route, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { defaultTo, isNil } from 'ramda';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, InteractionManager } from 'react-native';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';
import { useStoreActions, useStoreState } from '@core/store/store.ts';
import { chatScrollButtonForwardProps } from '@src/modules/chat/components/chat-scroll-button/ChatScrollButton.tsx';
import { ChatDataType, ChatDataTypeUnion, MESSAGES_PER_PAGE } from '@src/modules/chat/helpers/types.ts';
import { useChatEmitter } from '@src/modules/chat/helpers/hooks/useChatEmitter.ts';
import { createMessage, createTransferMessage, getMessagingURL } from '@src/modules/chat/helpers/functions.ts';
import { useWebsocket } from '@core/hooks/useWebsocket.ts';
import { tokensCacheStore } from '@core/caching';
import { ChatEvents, ChatMessageType } from '@core/store/storages/chat/chat.store.types.ts';

export const useChatDMState = () => {
  const {
    params: { topicId },
  } = useRoute<Route<string, RootStackParams[Routes.ChatScreen]>>();
  const {
    app: { setIsLoad },
    chats: {
      getMessageList,
      addDummyMessage,
      cleanMessageList,
      getFirstMessageId,
      getTopics,
    },
  } = useStoreActions((state) => state);
  const {
    user: { userData },
    chats: { messagesList, totalPages, topicsDictionary },
  } = useStoreState((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const myUserId = useMemo(() => defaultTo('', userData?.user_hash), [userData]);
  const currentPage = useRef<number>(1);
  const scrollListRef = useRef<FlatList<ChatDataTypeUnion>>(null);
  const chatButtonRef = useRef<chatScrollButtonForwardProps>(null);
  const isInitialLoad = useRef<boolean>(true);
  const userNotMe = topicsDictionary[topicId].users.find((el) => el.user_hash !== myUserId);
  const chatName = topicsDictionary[topicId].is_single ? `${userNotMe?.first_name} ${userNotMe?.patronymic} ${userNotMe?.last_name}` : topicsDictionary[topicId].name;

  const { onMessage, ...emitter } = useChatEmitter(myUserId, topicId);
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
    console.log('zxc');
  }, [navigation]);

  const onSendMessage = useCallback(
    async (value: string) => {
      const lastMessage = messagesList[0] as ChatMessageType;
      if (isNil(topicId) || isNil(userData)) return;
      const newMessage = createMessage(
        value,
        defaultTo(0, lastMessage?.id),
        ChatDataType.text,
        [],
        topicId,
        {
          user_hash: userData.user_hash,
          details: userData.details,
          first_name: userData.first_name,
          last_name: userData.last_name,
          patronymic: userData.patronymic,
          role: userData.role,
          university: userData.university,
          username: userData.username,
        },
      );
      addDummyMessage(newMessage);
      const transferMsg = createTransferMessage(ChatEvents.SendMessage, value);
      await transferData(transferMsg);

      InteractionManager.runAfterInteractions(() => {
        scrollListRef.current?.scrollToOffset({
          animated: true,
          offset: 0,
        });
      });
    },
    [messagesList, topicId, userData, addDummyMessage, transferData],
  );

  const onChatLoad = useCallback(async () => {
    try {
      if (!isNil(topicId)) {
        await Promise.all([
          getMessageList({
            topicId,
            page: 0,
            itemsPerPage: MESSAGES_PER_PAGE,
          }),
        ]);
        await connect();
        const lastMsgId = getFirstMessageId();
        !isNil(lastMsgId) &&
            (await transferData(
              createTransferMessage(ChatEvents.ReadAllMessage, `${lastMsgId}`),
            ));
      }
    } catch (e) {
   } finally {
      InteractionManager.runAfterInteractions(() => {
        setIsLoad(false);
      });
      isInitialLoad.current = false;
      await Promise.allSettled([getTopics()]);
    }
  }, [connect, getFirstMessageId, getMessageList, getTopics, setIsLoad, topicId, transferData]);

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

  useEffect(() => {
    setIsLoad(true);
    onChatLoad().then();
    return () => {
      closeSocket();
      cleanMessageList();
      currentPage.current = 1;
      if (!isNil(timerId.current)) clearTimeout(timerId.current);
    };
  }, []);

  return {
    messagesList,
    onSendMessage,
    myUserId,
    topicId,
    chatName,
    isLoading,
    setIsLoading,
    currentPage,
    onScrollTopReached,
    scrollListRef,
    chatButtonRef,
    isConnect,
  };
};
