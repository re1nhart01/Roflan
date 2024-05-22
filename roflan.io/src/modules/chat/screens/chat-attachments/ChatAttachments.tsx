import type { FC } from "react";
import React from "react";
import { Text } from "react-native";

import { useChatAttachmentsState } from "./chatAttachments.state";
import { chatAttachmentsStyles } from "./chatAttachments.styles";

const { Wrapper } = chatAttachmentsStyles;

export const ChatAttachments: FC = ({}) => {
  const {} = useChatAttachmentsState();

  return (
    <Wrapper>
      <Text>STUB</Text>
    </Wrapper>
  );
};
