import React, { FC } from 'react';
import { verifyScreenStyle } from '@src/modules/auth/screens/verify-screen/verifyScreen.style.ts';
import { useVerifyState } from '@src/modules/auth/screens/verify-screen/verify.state.ts';
import { Box, Text } from 'native-base';
import { Localization } from '@core/constants/localization.ts';
import { ErrorMessage } from '@components/molecules/error-message/ErrorMessage.tsx';
import { OTPInputView } from '@components/molecules/react-native-otp-input/OTPInputView.tsx';
import { TouchableOpacity } from 'react-native';

const { Wrapper, ButtonStyle } = verifyScreenStyle;

export const VerifyScreen: FC = () => {
  const {
    setCode,
    code,
    KEY_CODE_LENGTH,
    inputRef,
    handleFieldPress,
    isInvalid,
    opacityOfValue,
    phone,
    onCodeConfirm,
  } = useVerifyState();
  return (
    <Wrapper>
      <Box flex={1} bg="darkBlue.900" justifyContent="center" alignItems="center">
        <Text fontWeight="bold" textAlign="center" color="white" fontSize={48}>
          {Localization.auth.signIn.verify}
        </Text>
        <Text mt="4" textAlign="center" fontWeight="semibold" color="white" fontSize={18}>
          {Localization.auth.signIn.verifyCode}{phone}
        </Text>
        <Box pt="90px" alignItems="center" />
        <Box>
          <TouchableOpacity activeOpacity={1} onPress={handleFieldPress}>
            <Box maxW="750px" pb="12">
              <OTPInputView
                ref={inputRef}
                pinCount={KEY_CODE_LENGTH}
                code={code}
                autoFocusOnLoad
                onChange={setCode}
                onCodeChanged={setCode}
              />
              <ErrorMessage errorMessage="" hideIfTextEmpty />
            </Box>
          </TouchableOpacity>
          <Box maxW="750px" mt="16">
            <ButtonStyle opacity={opacityOfValue} disabled={isInvalid} onPress={onCodeConfirm}>
              <Text color="white" fontSize={16}>
                {Localization.auth.signIn.confirm}
              </Text>
            </ButtonStyle>
          </Box>
        </Box>
      </Box>
    </Wrapper>
  );
};
