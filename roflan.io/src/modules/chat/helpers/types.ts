import type {
  ChatDateSeparatorType,
  ChatMessageType,
} from '@core/store/storages/chat/chat.store.types.ts';

export const MESSAGES_PER_PAGE = 30;
export const INPUT_HEIGHT = 64;
export enum UIMessageType {
  first = 0,
  middle = 1,
  end = 2,
  none = 3,
}

export enum ChatDataType {
  text = 'text',
  media = 'media',
  link = 'link',
  separator = 'separator',
  seen = 'seen',
  online = 'online',
  offline = 'offline',
}

export type ChatTypeDictionary = {
  [ChatDataType.separator]: ChatDateSeparatorType;
  [ChatDataType.text]: ChatMessageType;
  [ChatDataType.media]: ChatMessageType;
  [ChatDataType.link]: ChatMessageType;
  [ChatDataType.seen]: ChatMessageType;
  [ChatDataType.online]: ChatMessageType;
  [ChatDataType.offline]: ChatMessageType;
};

export type IChatTypeDict<T extends ChatDataType> = ChatTypeDictionary[T];

export type ChatDataTypeUnion = ChatMessageType | ChatDateSeparatorType;
