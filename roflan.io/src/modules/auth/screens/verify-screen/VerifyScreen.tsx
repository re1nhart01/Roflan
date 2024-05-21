import React, { FC } from 'react';
import { verifyScreenStyle } from '@src/modules/auth/screens/verify-screen/verifyScreen.style.ts';
import { useVerifyState } from '@src/modules/auth/screens/verify-screen/verify.state.ts';

const { Wrapper, Text } = verifyScreenStyle;

export const VerifyScreen: FC = () => {
  const { } = useVerifyState();
  const a = 5;
  return (
    <Wrapper>
      <Text>WelcomeScreen</Text>
    </Wrapper>
  );
};
