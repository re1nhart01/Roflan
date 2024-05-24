import { useCallback, useEffect, useState } from 'react';
import { useStoreActions, useStoreState } from '@core/store/store.ts';
import { Alert } from 'react-native';

let hasRunEffect = false;

export const useCreateChatScreenState = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [chatName, setChatName] = useState('New Chat');
  const [isSingle, setIsSingle] = useState(false);
  const {
    app: { setIsLoad },
    user: { getMe, getUsersToCreateChat },
    chats: { getTopics, addTopic },
  } = useStoreActions((state) => state);
  const {
    user: { userList },
  } = useStoreState((state) => state);
  const handleSetIsSingle = useCallback(() => {
    setIsSingle(!isSingle);
  }, [isSingle]);

  const handleSetChatName = useCallback((v: string) => {
    setChatName(v);
  }, []);

  const handleAddOrRemoveUser = useCallback((v: string) => {
    setSelectedUsers((el) => {
      console.log(el, el.indexOf(v) !== -1, v);
      if (el.indexOf(v) === -1) {
        return [...el, v];
      }
      console.log(el.filter((el) => el !== v), 'filtered');
      return el.filter((el) => el !== v);
    });
  }, []);

  const onRefreshPress = useCallback(async () => {
    setIsLoad(true);
    try {
      await Promise.allSettled([getUsersToCreateChat()]);
    } catch (e) {
      setIsLoad(false);
    } finally {
      setIsLoad(false);
    }
  }, [getMe, setIsLoad]);

  const handleCreateOrGoToChat = useCallback(async () => {
    setIsLoad(true);
    try {
      await addTopic({
        name: chatName,
        isSingle,
        userIds: selectedUsers,
        avatarBucket: Date.now().toString(),
      });
      Alert.alert('OK!', 'Chat is successfully created!');
      await Promise.allSettled([getTopics()]);
    } catch (e) {
      console.log(123);
    } finally {
      setIsLoad(false);
    }
  }, [addTopic, chatName, getTopics, isSingle, selectedUsers, setIsLoad]);

  useEffect(() => {
    if (!hasRunEffect) {
      hasRunEffect = true;
      onRefreshPress?.().then();
    }
  }, []);

  return {
    handleAddOrRemoveUser,
    selectedUsers,
    handleCreateOrGoToChat,
    userList,
    handleSetChatName,
    isSingle,
    handleSetIsSingle,
    chatName,
    onRefreshPress,
  };
};
