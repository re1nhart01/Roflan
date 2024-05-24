import { equals } from 'ramda';

import {
  ChatEvents,
  ChatMessageType,
  EventMessage,
} from '@core/store/storages/chat/chat.store.types.ts';
import { useStoreActions } from '@core/store/store.ts';
import { createTransferMessage } from '../functions';
import { ChatDataType } from '../types';

export const useChatEmitter = (
  currentUserId: string,
  topicId: string | null,
) => {
  const {
    chats: { addDummyMessage, updateSendMessage },
  } = useStoreActions((state) => state);
  const onMessageHandler = async (
    event: { isTrusted: boolean; data: string },
    transferData: (d: { [p: string]: unknown }) => Promise<null | undefined>,
  ) => {
    console.log(event, 'EVENT');
    try {
      const m: EventMessage = JSON.parse(event?.data);
      console.log(m);
      switch (m.type) {
        case ChatEvents.SendMessage:
          const newMessage: { message: ChatMessageType; sender: string; } = m.data;
          // const seenMsg = createTransferMessage(ChatDataType.seen, +newMessage.id);
          // await transferData(seenMsg);
          const messageUserId = newMessage.sender;
          console.log(messageUserId, currentUserId);
          if (!equals(messageUserId, currentUserId)) {
            addDummyMessage(newMessage.message);
          } else {
            updateSendMessage(newMessage.message);
          }
          break;
        default:
          console.log('ON MESSAGE: unknown type', m.type);
          break;
      }
    } catch (e) {
      console.log('123', e);
    }
  };

  const onCloseHandler = async (close: Event) => {
    console.log('CONNECT TO SOCKET CLOSED! ', close);
  };

  const onErrorHandler = async (err: Event) => {
    console.log('CONNECT TO SOCKET ERROR!: ', err?.toString());
  };

  const onConnectHandler = async () => {

  };
  return {
    onClose: onCloseHandler,
    onConnect: onConnectHandler,
    onError: onErrorHandler,
    onMessage: onMessageHandler,
  };
};
