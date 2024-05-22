import { equals } from "ramda";

import { SENTRY_CUSTOM_EVENTS_MESSAGES } from "helpers/constants";
import { useSentry } from "services/analytics/sentry/useSentry";
import { useStoreActions } from "store/store";

import type {
  ChatMessageType,
  EventMessage,
} from "../../store/chat.store.types";
import { createTransferMessage } from "../functions";
import { ChatDataType } from "../types";

export const useChatEmitter = (
  currentUserId: string,
  topicId: string | null,
  requestId: string | number
) => {
  const { sentrySendCustomEvent } = useSentry();
  const {
    chats: { addDummyMessage, updateSendMessage },
  } = useStoreActions((state) => state);
  const onMessageHandler = async (
    event: EventMessage,
    transferData: (d: { [p: string]: unknown }) => Promise<null | undefined>
  ) => {
    try {
      const body: ChatMessageType = JSON.parse(event.data);
      const { type, id, sender }: ChatMessageType = body;
      switch (type) {
        case ChatDataType.text:
        case ChatDataType.link:
        case ChatDataType.media:
          const seenMsg = createTransferMessage(ChatDataType.seen, +id);
          await transferData(seenMsg);
          const messageUserId = sender.user.id;
          if (!equals(messageUserId, currentUserId)) {
            addDummyMessage(body);
          } else {
            updateSendMessage(body);
          }
          break;
        case ChatDataType.online:
        case ChatDataType.offline:
        case ChatDataType.seen:
          break;
        default:
          console.log("ON MESSAGE: unknown type", type);
          break;
      }
    } catch (e) {
      sentrySendCustomEvent(
        SENTRY_CUSTOM_EVENTS_MESSAGES.onMessageHandlerError,
        "error",
        {
          now: Date.now(),
          topicId,
          requestId,
          closeEvent: close.toString(),
        }
      );
    }
  };

  const onCloseHandler = async (close: Event) => {
    sentrySendCustomEvent(
      SENTRY_CUSTOM_EVENTS_MESSAGES.onCloseChatSocket,
      "warning",
      {
        now: Date.now(),
        topicId,
        requestId,
        closeEvent: close.toString(),
      }
    );
    if (__DEV__) {
      console.log("CONNECT TO SOCKET CLOSED! ", close);
    }
  };

  const onErrorHandler = async (err: Event) => {
    sentrySendCustomEvent(
      SENTRY_CUSTOM_EVENTS_MESSAGES.onErrorChatSocket,
      "error",
      {
        now: Date.now(),
        topicId,
        requestId,
        errorMsg: err?.toString(),
      }
    );
    if (__DEV__) {
      console.log("CONNECT TO SOCKET ERROR!: ", err?.toString());
    }
  };

  const onConnectHandler = async () => {
    sentrySendCustomEvent(
      SENTRY_CUSTOM_EVENTS_MESSAGES.onOpenChatSocket,
      "info",
      {
        now: Date.now(),
        topicId,
        requestId,
      }
    );
  };
  return {
    onClose: onCloseHandler,
    onConnect: onConnectHandler,
    onError: onErrorHandler,
    onMessage: onMessageHandler,
  };
};
