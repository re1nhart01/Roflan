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
import { BasePaginatorResponse, BaseRequest } from '@type/definitions.ts';
import type {
  ChatMessageType,
  ChatTopicType,
  ChatsModel,
  MessagesCountAPIType,
  MessagingAPIPagingType,
  UnreadCounterObject,
} from './chat.store.types.ts';
import {Alert} from "react-native";

const chatStore: ChatsModel = {
  topics: [],
  messagesList: [],
  totalPages: 0,
  messagesCounterDictionary: {},
  topicsDictionary: {},
  setTopics: action((state, payload) => {
    state.topics = payload;
    state.topicsDictionary = arrayToDictionary<ChatTopicType>(
      payload,
      'topic_hash',
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
  addTopic: thunk(async (state, { userIds, avatarBucket, isSingle, name }, { getStoreState }) => {
    try {
      const storeState = getStoreState() as StoreModel;
      const validUserIds = isSingle ? [userIds[0]] : userIds;
      const addTopicBody = {
        userIds: validUserIds,
        avatarBucket,
        name,
        isSingle,
      };
      console.log(addTopicBody);
      const { data } = await requester<BaseRequest<ChatTopicType>>(
        '/topic',
        'POST',
        {},
        addTopicBody,
        true,
      );
      if (data.response) {
        const isExists = storeState.chats.topicsDictionary[data.response.topic_hash];
        if (!isExists) {
          const topicsWithNew = [
            data.response,
            ...defaultTo([], storeState.chats.topics),
          ];
          state.setTopics(topicsWithNew);
        } else {
          Alert.alert('Warning', 'Chat with this user is already exists!');
        }
      }

      return data?.response;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        /* empty */
      } else {
        console.warn('Not Axios Error');
      }
      throw new Error('Aborting addTopic');
    }
  }),
  getTopicByRequestId: thunk((_, payload, { getStoreState }) => {
    const storeState = getStoreState() as StoreModel;
    if (storeState.chats.topics) {
      const item: ChatTopicType | undefined = storeState.chats.topics.find(
        (topic: ChatTopicType) => `${topic.topic_hash}` === `${payload}`,
      );
      return defaultTo(null, item);
    }
    return null;
  }),
  getTopics: thunk(async (actions) => {
    try {
      const { data } = await requester<BasePaginatorResponse<ChatTopicType>>(
        '/topic',
        'GET',
        {},
        undefined,
        true,
      );
      if (data.data) actions.setTopics(data.data);

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
        msg.user_hash_id === payload.user_hash_id
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
          BasePaginatorResponse<ChatMessageType>
        >(
          `/messages?limit=${itemsPerPage}&page=${page}&where=topic_hash_id['${topicId}']&order=created_at^desc`,
          'GET',
          {},
          undefined,
          true,
        );
        if (data.data) {
          const reorderedList = splitMessagesByDelimiter(
            defaultTo([], storeState.chats.messagesList),
            data.data,
          );
          actions.setMessageList(reorderedList);
          actions.setTotalPages(defaultTo(1, data.total_pages));
          console.log(data.data);
        }

        return data;
      } catch (e) {
        console.log(e);
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
    console.log(lastMessage, payload, messageListLength, 'ZXCZXCZX');
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
  reset: action((state) => {
    const filteredNewsModel = filteredFromActionsModel(chatStore);
    Object.assign(state, filteredNewsModel);
  }),
};

export default chatStore;
