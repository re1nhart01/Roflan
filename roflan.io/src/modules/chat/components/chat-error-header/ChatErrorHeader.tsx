import { useHeaderHeight } from '@react-navigation/elements';
import type { FC } from 'react';
import React from 'react';

import { Localization } from '@core/constants/localization.ts';
import { chatErrorHeaderStyles } from './chatErrorHeader.styles';

type chatErrorHeaderProps = {
  visible: boolean;
};

const { Wrapper, ErrorMessage } = chatErrorHeaderStyles;

const ChatErrorHeader: FC<chatErrorHeaderProps> = ({ visible }) => {
  const headerHeight = useHeaderHeight();
  if (!visible) {
    return null;
  }

  return (
    <Wrapper headerHeight={headerHeight}>
      <ErrorMessage>{Localization.errors.unexpectedError}</ErrorMessage>
    </Wrapper>
  );
};

export default ChatErrorHeader;
