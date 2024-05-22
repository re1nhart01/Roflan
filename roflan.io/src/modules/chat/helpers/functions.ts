// 20.09.23
// Yesterday 20:48 | Вчора 20:48
// Today 20:48 | Сьогодні 20:48
import { and, or } from 'ramda';

import { tokensCacheStore } from '@core/caching';
import NativeSampleModule from '@tm/NativeSampleModule.ts';
import { Localization } from '@core/constants/localization.ts';
import type {
  ChatDateSeparatorType,
  ChatMessageType,
  MediaDataType,
} from '../store/chat.store.types';
import type {
  ChatDataType,
  ChatDataTypeUnion,
  ChatTypeDictionary,
} from './types';
import { UIMessageType } from './types';

export const getMessagingURL = async (topicId: string | null) => {
  const token = await tokensCacheStore.take();
  const messaging = await NativeSampleModule?.getEnv('MESSAGING_URL_WSS');
  return `${messaging}api/messaging/${topicId}/${token.access_token}` as const;
};

export const createTransferMessage = (
  type: keyof ChatTypeDictionary,
  body: string | number,
) => ({
  type,
  body,
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

export const isToday = (date: Date) =>
  new Date().toDateString() === date.toDateString();

export const isYesterday = (date: Date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return yesterday.toDateString() === date.toDateString();
};

export const getTimeTextByDate = (t: (k: string) => string, time: Date) => {
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
  createdAt: date,
  id: `separator_${date.toString()}_${idx}`,
  type: 'separator',
  uiMessageType: UIMessageType.none,
});

const isSameAuthor = (l1: ChatDataTypeUnion, l2: ChatDataTypeUnion) =>
  (l1 as ChatMessageType).sender.user.id ===
  (l2 as ChatMessageType).sender.user.id;

export function splitMessagesByDelimiter(
  prev: ChatDataTypeUnion[],
  messages: ChatDataTypeUnion[],
) {
  if (messages.length === 0) return prev;
  const last = messages.length;
  let firstOfBunchDate = messages[0].createdAt;
  const orderedListOfMessages: ChatDataTypeUnion[] = [];
  let currentLastMessage = messages[0];
  const firstPrev = prev[prev.length - 1];
  if (
    prev.length > 0 &&
    stillSameMinute(currentLastMessage.createdAt, firstPrev.createdAt) &&
    messages[1] &&
    stillSameMinute(messages[1].createdAt, firstPrev.createdAt)
  ) {
    firstPrev.uiMessageType = UIMessageType.middle;
    currentLastMessage = firstPrev;
    messages[1].uiMessageType = UIMessageType.middle;
  }
  if (
    prev.length > 0 &&
    !stillCurrentDay(messages[0].createdAt, prev[prev.length - 1].createdAt)
  ) {
    orderedListOfMessages.push(
      createSeparator(prev[prev.length - 1].createdAt, `${last}`),
    );
  }
  for (let i = 0; i < messages.length; i++) {
    const currentMessage = messages[i];
    const next = messages[i + 1];
    if (
      currentMessage &&
      currentMessage.type !== 'separator' &&
      isSameAuthor(currentMessage, currentLastMessage) &&
      stillSameMinute(currentLastMessage.createdAt, currentMessage.createdAt)
    ) {
      currentLastMessage.uiMessageType = UIMessageType.end;
      currentMessage.uiMessageType = UIMessageType.middle;
      const isValidNext = next && next.type !== 'separator';
      if (
        or(
          (isValidNext &&
            !stillSameMinute(currentLastMessage.createdAt, next.createdAt)) ||
            (isValidNext && !isSameAuthor(next, currentLastMessage)),
          !isValidNext &&
            isSameAuthor(currentMessage, currentLastMessage) &&
            stillSameMinute(
              currentLastMessage.createdAt,
              currentMessage.createdAt,
            ),
        )
      ) {
        currentMessage.uiMessageType = UIMessageType.first;
      }
    } else if (currentLastMessage.type !== 'separator') {
      currentLastMessage = messages[i];
    }
    if (stillCurrentDay(firstOfBunchDate, messages[i].createdAt)) {
      orderedListOfMessages.push(messages[i]);
    } else {
      const delimiter = createSeparator(
        messages[i - 1].createdAt,
        `${messages[i].id}${i}`,
      );
      orderedListOfMessages.push(delimiter);
      orderedListOfMessages.push(messages[i]);
      firstOfBunchDate = messages[i].createdAt;
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
      stillSameMinute(lastMessageBefore.createdAt, message.createdAt)
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
    !stillCurrentDay(lastMessageBefore.createdAt, message.createdAt)
  ) {
    return [
      message,
      createSeparator(message.createdAt, `${message.id}${listLength}`),
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
  senderId: string,
): ChatMessageType {
  const currentDate = new Date().toISOString();
  return {
    sender: {
      createdAt: currentDate,
      id: senderId,
      lastRead: 0,
      status: '',
      topicId,
      updatedAt: currentDate,
      user: {
        avatar: '',
        createdAt: currentDate,
        email: '',
        firstName: '',
        id: senderId,
        lastName: '',
        patronymic: '',
        phone: '',
        position: '',
        role: '',
        updatedAt: '',
      },
      userId: senderId,
    },
    id: +lastMessageId + 1,
    externalId: null,
    type,
    body,
    payload: null,
    createdAt: currentDate,
    updatedAt: currentDate,
    topicId,
    senderId,
    isLocal: true,
    isLastRead: true,
    medias,
  };
}
