import React, { FC } from 'react';
import { signInStyle } from '@src/modules/auth/screens/sign-in-screen/signIn.style.ts';
import { useSignInState } from '@src/modules/auth/screens/sign-in-screen/signIn.state.ts';
import { Box } from 'native-base';
import { AnimatedInput } from '@components/molecules/animated-input/AnimatedInput.tsx';

const { Wrapper, Text } = signInStyle;

export const SignInScreen: FC = () => {
  const { } = useSignInState();
  const a = 5;
  return (
    <Wrapper>
      <Box flex={1} bg="darkBlue.900" justifyContent="center" alignItems="center">
        <AnimatedInput value="" setText={() => {}} maxLength={500} placeholder="aboba" />
      </Box>
    </Wrapper>
  );
};
