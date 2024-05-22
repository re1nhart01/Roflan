import styled from "styled-components/native";

import { Screen } from "components/atoms/screen/Screen";

export const chatAttachmentsStyles = {
  Wrapper: styled(Screen)`
    width: 100%;
    flex: 1;
    background-color: ${({ theme }) => theme.colors.secondaryBg};
  `,
};
