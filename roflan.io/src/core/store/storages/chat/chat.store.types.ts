import type { Action, Thunk } from 'easy-peasy';

import type {
  ChatDataType,
  ChatDataTypeUnion,
  UIMessageType,
} from '../../../../modules/chat/helpers/types.ts';

export interface ChatsModel {
  // topics
  topics: Array<ChatTopicType>;
  setTopics: Action<this, this['topics']>;
  getTopics: Thunk<this>;
  getTopicByRequestId: Thunk<this, number | string>;
  addTopic: Thunk<this, { externalId: string }>;
  // dictionaries
  topicsDictionary: { [key: string]: ChatTopicType };
  messagesCounterDictionary: { [key: string]: UnreadCounterObject };
  // messages
  messagesList: Array<ChatDataTypeUnion>;
  setMessageList: Action<this, this['messagesList']>;
  cleanMessageList: Action<this>;
  getMessageList: Thunk<
    this,
    {
      topicId: string;
      page: number;
      itemsPerPage: number;
    }
  >;
  // pages
  totalPages: number;
  setTotalPages: Action<this, this['totalPages']>;
  // adding message
  addDummyMessage: Action<this, ChatMessageType>;
  updateSendMessage: Action<this, ChatMessageType>;
  updateSpecificCounter: Action<
    this,
    { topicId: string; cb: (prev: number) => number }
  >;
  rollTopic: Thunk<this, string>;
  getFirstMessageId: Thunk<this>;
  getUnreadMessagesCounter: Thunk<this>;
  totalUnreadMessagesCount: number;
  setTotalUnreadMessagesCount: Action<this, UnreadCounterObject[]>;
  unreadCounterList: UnreadCounterObject[];
  setUnreadCounterList: Action<this, number>;
  reset: Action<this>;
}

export interface BaseChatType {
  id: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface EventMessage {
  isTrusted: boolean;
  data: string;
}

export interface ChatMessageType extends BaseChatType {
  id: number;
  externalId: string | null;
  type: ChatDataType;
  body: string;
  payload: null;
  createdAt: string;
  updatedAt: string;
  topicId: string;
  senderId: string;
  isLastRead: boolean;
  sender: {
    id: string;
    status: string;
    lastRead: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    topicId: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      patronymic: string;
      position: null | string;
      email: null | string;
      phone: string;
      role: string;
      avatar: null | string;
      createdAt: string;
      updatedAt: string;
    };
  };
  medias: Array<MediaDataType>;
  // for UI representation of bunch of messages which was sent in 3 minutes interval
  uiMessageType?: UIMessageType;
  isLocal?: boolean;
}

export type MediaDataType = {
  keep: null;
};

export interface MediaTypeMessage {
  uri: string;
  id: string;
  name: string;
  originalName: string;
  mimetype: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  messageId: string;
}

export interface ChatDateSeparatorType {
  createdAt: string;
  id: string;
  type: 'separator';
  uiMessageType: UIMessageType;
}

export interface ChatMemberType extends BaseChatType {
  status: 'active' | 'inactive' | 'archived';
  lastRead: number;
}

export interface ChatFileType extends BaseChatType {
  name: string;
  originalName: string;
  mimetype: string;
  size: number;
  uri: void; // VIRTUAL METHOD;
}

export interface ChatUserType extends BaseChatType {
  firstName: string;
  lastName: string;
  patronymic: string;
  position: string;
  email: string;
  phone: string;
  role: string;
  avatar: string; // len 1275;
}

export interface ChatTopicType extends BaseChatType {
  externalId: string | number;
  picture?: string; // len 2048
  name: string;
  topicId: string;
}

export interface MessagingAPIPagingType<T extends object> {
  count: number;
  data: Array<T>;
  page: number;
  pageCount: number;
  total: number;
}

export interface MessagesCountAPIType {
  count: UnreadCounterObject[];
  total: string;
}

export interface UnreadCounterObject {
  new: string;
  topicId: string;
  userId: string;
  last: ChatMessageType;
}
