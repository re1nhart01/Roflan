import type { FC } from "react";
import React from "react";

import { isIOS } from "helpers/constants";
import ChatListView from "modules/chat/components/chat-list-view/ChatListView";

import ChatErrorHeader from "../../components/chat-error-header/ChatErrorHeader";
import ChatInputView from "../../components/chat-input-view/ChatInputView";
import { useChatDMState } from "./chatDM.state";
import { chatDMStyles } from "./chatDM.styles";

const { Wrapper, KeyboardAvoidingView } = chatDMStyles;
const behavior = isIOS ? "padding" : undefined;
export const ChatDM: FC = () => {
  const {
    requestId,
    messagesList,
    onSendMessage,
    myUserId,
    isLoading,
    setIsLoading,
    onScrollTopReached,
    scrollListRef,
    chatButtonRef,
    isConnect,
    isValidStatus,
  } = useChatDMState();

  return (
    <Wrapper>
      <ChatErrorHeader visible={isValidStatus && !isConnect} />
      <KeyboardAvoidingView behavior={behavior} keyboardVerticalOffset={0}>
        <ChatListView
          chatButtonRef={chatButtonRef}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          myUserId={myUserId}
          requestId={requestId}
          data={messagesList}
          onScrollTopReached={onScrollTopReached}
          scrollListRef={scrollListRef}
        />
        {isValidStatus && <ChatInputView onSendMessage={onSendMessage} />}
      </KeyboardAvoidingView>
    </Wrapper>
  );
};
