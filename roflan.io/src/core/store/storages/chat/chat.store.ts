import axios from 'axios';
import { action, thunk } from 'easy-peasy';
import { defaultTo, isNil } from 'ramda';

import {
  addMessageWithSeparation,
  splitMessagesByDelimiter,
} from '@src/modules/chat/helpers/functions.ts';
import { arrayToDictionary, filteredFromActionsModel } from '@core/helpers/functions.ts';
import { StoreModel } from '@core/store/store.type.ts';
import { requester } from '@core/http/requester.ts';
import type {
  ChatMessageType,
  ChatTopicType,
  ChatsModel,
  MessagesCountAPIType,
  MessagingAPIPagingType,
  UnreadCounterObject,
} from './chat.store.types.ts';

const chatStore: ChatsModel = {
  topics: [],
  messagesList: [],
  unreadCounterList: [],
  totalUnreadMessagesCount: 0,
  totalPages: 0,
  messagesCounterDictionary: {},
  topicsDictionary: {},
  setTopics: action((state, payload) => {
    state.topics = payload;
    state.topicsDictionary = arrayToDictionary<ChatTopicType>(
      payload,
      'externalId',
    );
  }),
  updateSpecificCounter: action((state, payload) => {
    const prev = state.messagesCounterDictionary[payload.topicId];
    const prevCounter = payload.cb(prev ? +prev.new : 0);
    state.messagesCounterDictionary[payload.topicId] = <UnreadCounterObject>{
      ...(!isNil(prev) ? prev : {}),
      new: `${prevCounter}`,
      topicId: payload.topicId,
    };
  }),
  rollTopic: thunk(async (state, payload, { getState }) => {
    const modelState = getState();
    const isExists = modelState.topicsDictionary[payload];
    if (!isExists) {
      await state.addTopic({ externalId: `${payload}` });
    }
  }),
  addTopic: thunk(async (state, { externalId }, { getStoreState }) => {
    try {
      const storeState = getStoreState() as StoreModel;

      const addTopicBody = {
        order: `/api/orders/${externalId}`,
      };

      const { data } = await requester<ChatTopicType>(
        'orders/chat/topic',
        'POST',
        {},
        addTopicBody,
        true,
      );
      const editedNewTopic: ChatTopicType = {
        topicId: data.topicId,
        id: data.topicId,
        createdAt: data.createdAt,
        name: `${data.id}`,
        externalId: `${data.id}`,
        updatedAt: data.createdAt,
      };
      const topicsWithNew = [
        editedNewTopic,
        ...defaultTo([], storeState.chats.topics),
      ];
      state.setTopics(topicsWithNew);
      return data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        /* empty */ } else {
        console.warn('Not Axios Error');
      }
      throw new Error('Aborting addTopic');
    }
  }),
  getTopicByRequestId: thunk((_, payload, { getStoreState }) => {
    const storeState = getStoreState() as StoreModel;
    if (storeState.chats.topics) {
      const item: ChatTopicType | undefined = storeState.chats.topics.find(
        (topic: ChatTopicType) => `${topic.externalId}` === `${payload}`,
      );
      return defaultTo(null, item);
    }
    return null;
  }),
  getTopics: thunk(async (actions) => {
    try {
      const { data } = await requester<MessagingAPIPagingType<ChatTopicType>>(
        'topics',
        'GET',
        {},
        undefined,
        true,
      );
      actions.setTopics(data.data);

      return data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        /* empty */
      } else {
        console.warn('Not Axios Error');
      }
      throw new Error('Aborting getTopics');
    }
  }),
  setMessageList: action((state, payload) => {
    state.messagesList = payload;
  }),
  cleanMessageList: action((state) => {
    state.messagesList = [];
  }),
  updateSendMessage: action((state, payload) => {
    const msgList = state.messagesList;
    if (msgList.length === 1 && msgList[0]?.type !== 'separator') {
      (msgList[0] as ChatMessageType).isLocal = false;
      msgList[0].id = payload.id;
      return;
    }
    const foundedFromId = msgList.find((el) => {
      const msg = el as ChatMessageType;
      if (msg.id === payload.id) {
        return true;
      }
      if (
        msg.isLocal &&
        msg.body === payload.body &&
        msg.sender.user.id === payload.sender.user.id
      ) {
        msg.id = payload.id;
        return true;
      }
      return false;
    });
    if (!isNil(foundedFromId)) {
      (foundedFromId as ChatMessageType).isLocal = false;
    }
  }),
  getMessageList: thunk(
    async (actions, { topicId, page, itemsPerPage }, { getStoreState }) => {
      try {
        const storeState = getStoreState() as StoreModel;
        const { data } = await requester<
          MessagingAPIPagingType<ChatMessageType>
        >(
          `messages?limit=${itemsPerPage}&page=${page}&filter=topic.id||$eq||${topicId}&sort=createdAt,DESC`,
          'GET',
          {},
          undefined,
          true,
        );
        const reorderedList = splitMessagesByDelimiter(
          storeState.chats.messagesList,
          data.data,
        );
        actions.setMessageList(reorderedList);
        actions.setTotalPages(defaultTo(1, data.pageCount));

        return data;
      } catch (e) {
        if (axios.isAxiosError(e)) {
          /* empty */
        } else {
          console.warn('Not Axios Error');
        }
        throw new Error('Aborting getTopics');
      }
    },
  ),
  setTotalPages: action((state, payload) => {
    state.totalPages = payload;
  }),
  addDummyMessage: action((state, payload) => {
    const messageListLength = state.messagesList.length;
    const lastMessage = state.messagesList[0];
    const withSeparator = addMessageWithSeparation(
      lastMessage,
      payload,
      messageListLength,
    );
    state.messagesList = [...withSeparator, ...state.messagesList];
  }),
  getFirstMessageId: thunk((_, __, { getStoreState }) => {
    const storeState = getStoreState() as StoreModel;
    return defaultTo(null, storeState.chats.messagesList?.[0]?.id);
  }),
  getUnreadMessagesCounter: thunk(async (actions) => {
    try {
      const { data } = await requester<MessagesCountAPIType[]>(
        'topics/messages/count',
        'GET',
        {},
        undefined,
        true,
      );
      const response = defaultTo({ total: 0, count: [] }, data[0]);
      actions.setTotalUnreadMessagesCount(defaultTo([], response.count));
      actions.setUnreadCounterList(defaultTo(0, +response.total));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        /* empty */
      } else {
        console.warn('Not Axios Error');
      }
      throw new Error('Aborting getUnreadMessagesCounter');
    }
  }),
  setUnreadCounterList: action((state, payload) => {
    state.totalUnreadMessagesCount = +payload;
  }),
  setTotalUnreadMessagesCount: action((state, payload) => {
    state.unreadCounterList = payload;
    state.messagesCounterDictionary = arrayToDictionary(payload, 'topicId');
  }),
  reset: action((state) => {
    const filteredNewsModel = filteredFromActionsModel(chatStore);
    Object.assign(state, filteredNewsModel);
  }),
};

export default chatStore;
