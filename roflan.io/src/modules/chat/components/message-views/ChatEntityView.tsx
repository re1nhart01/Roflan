import React, { memo, useCallback } from 'react';

import type {
  ChatDateSeparatorType,
  ChatMessageType,
} from '@core/store/storages/chat/chat.store.types.ts';
import type { IChatTypeDict } from '../../helpers/types';
import { ChatDataType } from '../../helpers/types';
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
        case ChatDataType.separator:
          return <ChatDateSeparator data={props as ChatDateSeparatorType} />;
        case 's':
        default:
          return (
            <TextMessageView
              myUserId={myUserId}
              index={index}
              messageData={props}
            />
          );
      }
    },
    [index, myUserId],
  );
  return <>{renderContent(data)}</>;
};

export default memo(ChatEntityView);
