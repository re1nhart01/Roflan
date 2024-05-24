// 20.09.23
// Yesterday 20:48 | Вчора 20:48
// Today 20:48 | Сьогодні 20:48
import { and, or } from 'ramda';

import { tokensCacheStore } from '@core/caching';
import NativeMainModule from '@tm/NativeMainModule.ts';
import { Localization } from '@core/constants/localization.ts';
import {
  ChatDateSeparatorType, ChatEvents,
  ChatMessageType,
  MediaDataType,
} from '@core/store/storages/chat/chat.store.types.ts';
import type {
  ChatDataType,
  ChatDataTypeUnion,
  ChatTypeDictionary,
} from './types';
import { UIMessageType } from './types';

export const getMessagingURL = async (topicId: string | null) => {
  const token = await tokensCacheStore.take();
  const messaging = 'ws://localhost:8080/api/v2/';
  console.log(`${messaging}messaging/${topicId}/${token.access_token}`);
  return `${messaging}messaging/${topicId}/${token.access_token}` as const;
};

export const createTransferMessage = (
  type: ChatEvents,
  body: string | number,
) => ({
  type,
  data: { body, mediaIds: [] },
});

export const getExactTime = (date: Date) =>
  date.toLocaleTimeString('en-GB', {
    minute: '2-digit',
    hour: '2-digit',
    second: undefined,
  });

export const getExactDate = (date: Date) =>
  date.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

// Example usage:
const randomString = generateRandomString(10); // Generates a random string of length 10
console.log(randomString);

export const isToday = (date: Date) =>
  new Date().toDateString() === date.toDateString();

export const isYesterday = (date: Date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return yesterday.toDateString() === date.toDateString();
};

export const getTimeTextByDate = (time: Date) => {
  if (isToday(time)) {
    return `${Localization.time.today} ${getExactTime(time)}`;
  } if (isYesterday(time)) {
    return `${Localization.time.yesterday} ${getExactTime(time)}`;
  }
  return `${getExactDate(time)}`;
};

const stillSameMinute = (minutes1: string, minutes2: string) =>
  Math.abs(+new Date(minutes1) - +new Date(minutes2)) < 90000;

const stillCurrentDay = (dayOfMessage: string, currentDay: string) => {
  const d1 = new Date(dayOfMessage);
  const d2 = new Date(currentDay);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const createSeparator = (date: string, idx: string): ChatDateSeparatorType => ({
  created_at: date,
  id: `separator_${date?.toString()}_${idx}`,
  type: 'separator',
  uiMessageType: UIMessageType.none,
});

const isSameAuthor = (l1: ChatDataTypeUnion, l2: ChatDataTypeUnion) =>
  (l1 as ChatMessageType).user_owner.user_hash ===
  (l2 as ChatMessageType).user_owner.user_hash;

export function splitMessagesByDelimiter(
  prev: ChatDataTypeUnion[],
  messages: ChatDataTypeUnion[],
) {
  if (messages.length === 0) return prev;
  const last = messages.length;
  let firstOfBunchDate = messages[0].created_at;
  const orderedListOfMessages: ChatDataTypeUnion[] = [];
  let currentLastMessage = messages[0];
  const firstPrev = prev[prev.length - 1];
  if (
    prev.length > 0 &&
    stillSameMinute(currentLastMessage.created_at, firstPrev.created_at) &&
    messages[1] &&
    stillSameMinute(messages[1].created_at, firstPrev.created_at)
  ) {
    firstPrev.uiMessageType = UIMessageType.middle;
    currentLastMessage = firstPrev;
    messages[1].uiMessageType = UIMessageType.middle;
  }
  if (
    prev.length > 0 &&
    !stillCurrentDay(messages[0].created_at, prev[prev.length - 1].created_at)
  ) {
    orderedListOfMessages.push(
      createSeparator(prev[prev.length - 1].created_at, `${last}`),
    );
  }
  for (let i = 0; i < messages.length; i++) {
    const currentMessage = messages[i];
    const next = messages[i + 1];
    if (
      currentMessage &&
      currentMessage.type !== 'separator' &&
      isSameAuthor(currentMessage, currentLastMessage) &&
      stillSameMinute(currentLastMessage.created_at, currentMessage.createdAt)
    ) {
      currentLastMessage.uiMessageType = UIMessageType.end;
      currentMessage.uiMessageType = UIMessageType.middle;
      const isValidNext = next && next.type !== 'separator';
      if (
        or(
          (isValidNext &&
            !stillSameMinute(currentLastMessage.created_at, next.createdAt)) ||
            (isValidNext && !isSameAuthor(next, currentLastMessage)),
          !isValidNext &&
            isSameAuthor(currentMessage, currentLastMessage) &&
            stillSameMinute(
              currentLastMessage.created_at,
              currentMessage.createdAt,
            ),
        )
      ) {
        currentMessage.uiMessageType = UIMessageType.first;
      }
    } else if (currentLastMessage.type !== 'separator') {
      currentLastMessage = messages[i];
    }
    if (stillCurrentDay(firstOfBunchDate, messages[i].created_at)) {
      orderedListOfMessages.push(messages[i]);
    } else {
      const delimiter = createSeparator(
        messages[i - 1].created_at,
        `${messages[i].id}${i}`,
      );
      orderedListOfMessages.push(delimiter);
      orderedListOfMessages.push(messages[i]);
      firstOfBunchDate = messages[i].created_at;
    }
  }
  return [...prev, ...orderedListOfMessages];
}

export function addMessageWithSeparation(
  lastMessageBefore: ChatDataTypeUnion,
  message: ChatDataTypeUnion,
  listLength: number,
) {
  if (lastMessageBefore) {
    const equalIds = and(
      lastMessageBefore.type !== 'separator',
      isSameAuthor(lastMessageBefore, message),
    );
    if (
      equalIds &&
      stillSameMinute(lastMessageBefore.created_at, message.created_at)
    ) {
      if (lastMessageBefore.uiMessageType !== UIMessageType.first) {
        lastMessageBefore.uiMessageType = UIMessageType.middle;
      }
      message.uiMessageType = UIMessageType.end;
    } else {
      if (lastMessageBefore.uiMessageType === UIMessageType.first) {
        lastMessageBefore.uiMessageType = undefined;
      }
      message.uiMessageType = UIMessageType.first;
    }
  }
  if (
    lastMessageBefore &&
    !stillCurrentDay(lastMessageBefore.created_at, message.created_at)
  ) {
    return [
      message,
      createSeparator(message.created_at, `${message.id}${listLength}`),
    ];
  }
  return [message];
}

export function createMessage(
  body: string,
  lastMessageId: number,
  type: ChatDataType,
  medias: MediaDataType[],
  topicId: string,
  sender: ChatMessageType['user_owner'],
): ChatMessageType {
  const currentDate = new Date().toISOString();
  return {
    type: 's',
    body,
    createdAt: new Date().toString(),
    created_at: new Date().toString(),
    deleted_at: new Date().toString(),
    id: lastMessageId + 1,
    isLocal: true,
    media: [],
    message_id: generateRandomString(20),
    message_status: 1,
    topic_hash_id: topicId,
    uiMessageType: 0,
    updatedAt: new Date().toString(),
    updated_at: new Date().toString(),
    user_hash_id: sender.user_hash,
    user_owner: sender,
    with_media: false,

  };
}
