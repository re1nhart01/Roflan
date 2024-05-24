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
  addTopic: Thunk<this, { userIds: string[], avatarBucket: string; name: string; isSingle: boolean; }>;
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
  getFirstMessageId: Thunk<this>;
  reset: Action<this>;
}

export interface BaseChatType {
  id: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface EventMessage {
  type: ChatEvents;
  data: any;
}

export enum ChatEvents {
  SendMessage = 'sendMessage',
  Connect = 'connect',
  CloseConn = 'close',
  Online = 'online',
  ReadAllMessage = 'readAllMessages',
  RemoveOneMessage = 'removeOneMessage',
  RemoveBunchMessages = 'removeBunchMessages',
}

export interface ChatMessageType extends BaseChatType {
  'id': number;
  'body': string;
  type?: 's';
  'created_at': string;
  'deleted_at': string;
  'media': MediaTypeMessage[];
  'message_id': string;
  'message_status': number;
  'topic_hash_id': string;
  'updated_at': string;
  'user_hash_id': string;
  'user_owner': {
    'details': string;
    'first_name': string;
    'last_name': string;
    'patronymic': string;
    'role': number;
    'university': string;
    'user_hash': string;
    'username': string;
  },
  'with_media': boolean;
  // for UI representation of bunch of messages which was sent in 3 minutes interval
  uiMessageType?: UIMessageType;
  isLocal?: boolean;
}

export type MediaDataType = {
  keep: null;
};

export interface MediaTypeMessage {
  'bucket_id': string;
  'created_at': string;
  'deleted_at': string;
  'file_name': string;
  'from_file_id': string;
  'from_message_id': string;
  'id': number;
  'owner_user_hash': string;
  'updated_at': string;
  'user_hash_id': string;
}

export interface ChatDateSeparatorType {
  created_at: string;
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

export interface ChatTopicUserType {
  'birthday': string,
  'city': string,
  'country': string,
  'created_at': string,
  'deleted_at': string,
  'details': string,
  'first_name': string,
  'id': number,
  'last_name': string,
  'patronymic': string,
  'phone': string,
  'role': number,
  'topic_hash_id': string,
  'university': string,
  'updated_at': string,
  'user_hash': string,
  'user_hash_id': string,
  'username': string
}
export interface ChatTopicType extends BaseChatType {
  'active': boolean,
  'avatar_bucket': string,
  'created_at': string,
  'deleted_at': string,
  'id': number,
  'is_single': boolean,
  'name': string,
  'topic_hash': string,
  'topic_hash_id': string,
  'updated_at': string,
  'user_hash_id': string,
  'users': ChatTopicUserType[]
  'lastMessage': {
    'birthday': string;
    'body': string,
    'city': string;
    'country': null;
    'created_at': string;
    'deleted_at': string;
    'details': string | null;
    'first_name': string;
    'id': number;
    'last_name':string;
    'message_id': string;
    'message_status': number,
    'patronymic': null,
    'phone': null,
    'role': number;
    'topic_hash_id': string;
    'university': string;
    'updated_at': string;
    'user_hash': null,
    'user_hash_id': string;
    'username': string;
    'with_media': boolean;
  };
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
