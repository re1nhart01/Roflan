import React, { FC } from 'react';
import { signInStyle } from '@src/modules/auth/screens/sign-in-screen/signIn.style.ts';
import { useSignUpState } from '@src/modules/auth/screens/sign-up-screen/signUp.state.ts';

const { Wrapper, Text } = signInStyle;

export const SignUpScreen: FC = () => {
  const { } = useSignUpState();
  const a = 5;
  return (
    <Wrapper>
      <Text>SignUpScreen</Text>
    </Wrapper>
  );
};
