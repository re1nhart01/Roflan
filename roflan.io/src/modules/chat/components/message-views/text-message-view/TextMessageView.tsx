import { defaultTo, equals, isNil } from "ramda";
import type { FC } from "react";
import React, { useMemo } from "react";

import { getExactTime } from "modules/chat/helpers/functions";
import { UIMessageType } from "modules/chat/helpers/types";
import type { ChatMessageType } from "modules/chat/store/chat.store.types";

import { textMessageViewStyles } from "./textMessageView.styles";

type textMessageViewProps = {
  messageData: ChatMessageType;
  index: number;
  myUserId: string;
};

const {
  Wrapper,
  ContentText,
  MessageContainer,
  DateWrapper,
  DateText,
  NameLabelText,
  MessageTile,
  MessageFang,
  InnerContainer,
} = textMessageViewStyles;

const TextMessageView: FC<textMessageViewProps> = ({
  messageData,
  myUserId,
}) => {
  const {
    sender: {
      user: { firstName, lastName },
    },
    uiMessageType,
    isLocal,
  } = messageData;
  const isMyMessage = useMemo(
    () => equals(myUserId, messageData.sender?.user.id),
    [messageData.sender?.user.id, myUserId]
  );

  const renderMessageLabel = () => {
    if (isMyMessage) return null;
    return isNil(uiMessageType) || uiMessageType === UIMessageType.first ? (
      <NameLabelText>
        {firstName} {lastName}
      </NameLabelText>
    ) : null;
  };

  const timeOfMessage = getExactTime(new Date(messageData.createdAt));
  return (
    <Wrapper isMyMessage={isMyMessage}>
      <MessageTile>
        {renderMessageLabel()}
        <MessageContainer
          isLocal={isLocal}
          uiMessageType={defaultTo(UIMessageType.none, uiMessageType)}
          isMyMessage={isMyMessage}
        >
          <InnerContainer>
            <ContentText selectable>{messageData.body}</ContentText>
            <DateWrapper>
              <DateText>{timeOfMessage}</DateText>
            </DateWrapper>
          </InnerContainer>
          {isNil(uiMessageType) || uiMessageType === UIMessageType.end ? (
            <MessageFang
              type="messageFang"
              isMyMessage={isMyMessage}
              uiMessageType={uiMessageType}
            />
          ) : null}
        </MessageContainer>
      </MessageTile>
    </Wrapper>
  );
};

export default TextMessageView;
