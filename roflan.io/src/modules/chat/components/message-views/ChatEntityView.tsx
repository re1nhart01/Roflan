import React, { memo, useCallback } from 'react';

import type { IChatTypeDict } from '../../helpers/types';
import { ChatDataType } from '../../helpers/types';
import type {
  ChatDateSeparatorType,
  ChatMessageType,
} from '../../store/chat.store.types';
import { ChatDateSeparator } from '../chat-date-separator/ChatDateSeparator';
import { chatEntityViewStyles } from './chatEntityView.styles';
import TextMessageView from './text-message-view/TextMessageView';

interface chatEntityViewProps {
  myUserId: string;
  data: ChatDateSeparatorType | ChatMessageType;
  index: number;
}

const {} = chatEntityViewStyles;
const ChatEntityView = ({ data, index, myUserId }: chatEntityViewProps) => {
  const renderContent = useCallback(
    <T extends ChatDataType>(props: IChatTypeDict<T>) => {
      switch (props.type) {
        case ChatDataType.text:
          return (
            <TextMessageView
              myUserId={myUserId}
              index={index}
              messageData={props}
            />
          );
        case ChatDataType.separator:
          return <ChatDateSeparator data={props as ChatDateSeparatorType} />;
        case ChatDataType.media:
        case ChatDataType.link:
        default:
          return <></>;
      }
    },
    [index, myUserId],
  );
  return <>{renderContent(data)}</>;
};

export default memo(ChatEntityView);