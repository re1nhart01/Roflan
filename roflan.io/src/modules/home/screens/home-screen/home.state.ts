import { useCallback, useEffect, useState } from 'react';
import { useStoreActions } from '@core/store/store.ts';
import { useFocusEffect } from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';

let hasRunEffect = false;
export const useHomeState = () => {
  const {
    app: { setIsLoad },
    user: { getMe },
    chats: { getTopics },
  } = useStoreActions((state) => state);

  const onRefreshPress = useCallback(async () => {
    setIsLoad(true);
    try {
      await Promise.allSettled([getMe(), getTopics()]);
    } catch (e) {
      setIsLoad(false);
    } finally {
      setIsLoad(false);
    }
  }, [getMe, setIsLoad]);

  useEffect(() => {
    if (!hasRunEffect) {
      hasRunEffect = true;
      onRefreshPress?.().then();
    }
  }, []);

  return {
    onRefreshPress,
  };
};
