import type { FC } from 'react';
import React from 'react';

import ChatListView from '@src/modules/chat/components/chat-list-view/ChatListView.tsx';
import ChatInputView from '../../components/chat-input-view/ChatInputView';
import { useChatDMState } from './chatDM.state';
import { chatDMStyles } from './chatDM.styles';
import { Box, Text } from "native-base";

const { Wrapper, KeyboardAvoidingView } = chatDMStyles;
export const ChatDM: FC = () => {
  const {
    messagesList,
    onSendMessage,
    myUserId,
    isLoading,
    setIsLoading,
    onScrollTopReached,
    scrollListRef,
    chatButtonRef,
    chatName,
    topicId,
    isConnect,
  } = useChatDMState();

  return (
    <Wrapper>
      <Box pt="4" pb="4" pl="4" w="100%" justifyContent="center">
        <Text textAlign="left" fontSize="20" color="white">
          Chat Name: { chatName }
        </Text>
      </Box>
      <ChatListView
        topicId={topicId}
        chatButtonRef={chatButtonRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        myUserId={myUserId}
        data={messagesList}
        onScrollTopReached={onScrollTopReached}
        scrollListRef={scrollListRef}
      />
      <ChatInputView onSendMessage={onSendMessage} />
    </Wrapper>
  );
};
