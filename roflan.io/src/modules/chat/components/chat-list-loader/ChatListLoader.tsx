import type { FC } from 'react';
import React from 'react';

import { chatListLoaderStyles } from './chatListLoader.styles';

type chatListLoaderProps = {
  visible: boolean;
};

const { ActivityLoader, EmptyView, Wrapper } = chatListLoaderStyles;

const ChatListLoader: FC<chatListLoaderProps> = ({ visible }) => {
  if (!visible) {
    return <EmptyView />;
  }
  return (
    <Wrapper>
      <ActivityLoader />
    </Wrapper>
  );
};

export default ChatListLoader;
