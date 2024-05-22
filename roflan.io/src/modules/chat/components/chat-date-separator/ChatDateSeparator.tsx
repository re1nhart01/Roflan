import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getTimeTextByDate } from '../../helpers/functions';
import type { ChatDateSeparatorType } from '@core/store/storages/chat/chat.store.types.ts';
import { chatDateSeparatorStyles } from './chatDateSeparator.styles';

type chatDateSeparatorProps = {
  data: ChatDateSeparatorType;
};

const { Wrapper, Text, Container } = chatDateSeparatorStyles;

export const ChatDateSeparator: FC<chatDateSeparatorProps> = ({ data }) => {
  const currentDate = new Date(data.createdAt);
  const { t } = useTranslation();
  return (
    <Container>
      <Wrapper>
        <Text>{getTimeTextByDate(t, currentDate)}</Text>
      </Wrapper>
    </Container>
  );
};
