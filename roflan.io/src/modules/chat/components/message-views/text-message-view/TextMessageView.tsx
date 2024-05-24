import { defaultTo, equals, isNil } from 'ramda';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import { UIMessageType } from '@src/modules/chat/helpers/types.ts';
import { getExactTime } from '@src/modules/chat/helpers/functions.ts';
import { ChatMessageType } from '@core/store/storages/chat/chat.store.types.ts';
import { textMessageViewStyles } from './textMessageView.styles';
import {View} from "react-native";

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
    user_owner: {
      first_name, last_name, patronymic,
    },
    uiMessageType,
    isLocal,
  } = messageData;
  const isMyMessage = useMemo(
    () => equals(myUserId, messageData.user_owner.user_hash),
    [messageData.user_owner.user_hash, myUserId],
  );

  const renderMessageLabel = () => {
    if (isMyMessage) return <View />;
    return (
      <NameLabelText>
        {first_name}
        {' '}
        { patronymic }
        {' '}
        {last_name}
      </NameLabelText>
    );
  };

  const timeOfMessage = getExactTime(new Date(messageData.created_at));
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
        </MessageContainer>
      </MessageTile>
    </Wrapper>
  );
};

export default TextMessageView;
