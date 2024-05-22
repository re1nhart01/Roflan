import React, { FC } from 'react';
import { signInStyle } from '@src/modules/auth/screens/sign-in-screen/signIn.style.ts';
import { useSignInState } from '@src/modules/auth/screens/sign-in-screen/signIn.state.ts';
import { Box, Text } from 'native-base';
import { AnimatedInput } from '@components/molecules/animated-input/AnimatedInput.tsx';
import { FormadjoForm } from '@core/validators/FormadjoForm.tsx';
import { ISignInFormTemplate } from '@src/modules/auth/forms/auth.forms.type.ts';
import { signInForm } from '@src/modules/auth/forms/auth.forms.ts';
import { ErrorMessage } from '@components/molecules/error-message/ErrorMessage.tsx';
import { Localization } from '@core/constants/localization.ts';
import { MAX_PHONE_LENGTH } from '@components/molecules/phone-input/PhoneInput.tsx';
import { ButtonComponent } from '@components/atoms/button/Button.tsx';

const { Wrapper, ButtonStyle, QRCode, BoxQr, CodeBox } = signInStyle;

export const SignInScreen: FC = () => {
  const { handleGoToSignUp, handleSignIn, handleCopyText, setPhone } = useSignInState();
  return (
    <Wrapper>
      <Box flex={1} bg="darkBlue.900" justifyContent="center" alignItems="center">
        <FormadjoForm<ISignInFormTemplate>
          removeErrorOnChange
          form={signInForm}
          onFinishSubmit={handleSignIn}
          initialProps={{ phone: '', password: '' }}
        >
          {
                  ({
                    values,
                    onSubmit,
                    updateFormState,
                    errorsList: { phone, password },
                  }) => {
                    return (
                      <Box>
                        <Box alignItems="center">
                          <BoxQr>
                            <QRCode source={require('@assets/png/qr.png')} />
                            <Text textAlign="center" color="white" fontSize={12}>
                              {Localization.info.qr}
                            </Text>
                            <CodeBox>
                              <Text onPress={handleCopyText} color="white" selectable>
                                {Localization.info.qrExample}
                              </Text>
                            </CodeBox>
                          </BoxQr>
                        </Box>
                        <Box maxW="750px" pb="12">
                          <AnimatedInput
                            maxLength={MAX_PHONE_LENGTH}
                            value={values.phone}
                            placeholder={Localization.placeholders.phone}
                            setText={(v) => { updateFormState('phone', v); setPhone(v); }}
                          />
                          <ErrorMessage errorMessage={phone.errorMessage} hideIfTextEmpty />
                        </Box>
                        <Box maxW="750px" pb="12">
                          <AnimatedInput
                            maxLength={100}
                            value={values.password}
                            placeholder={Localization.placeholders.password}
                            setText={(v) => updateFormState('password', v)}
                          />
                          <ErrorMessage errorMessage={password.errorMessage} hideIfTextEmpty />
                        </Box>
                        <Box>
                          <ButtonStyle onPress={onSubmit}>
                            <Text color="white" fontSize={14}>
                              {Localization.onboarding.goBtn}
                            </Text>
                          </ButtonStyle>
                        </Box>
                        <Box>
                          <ButtonComponent background="transparent" onPress={handleGoToSignUp}>
                            <Text pt="4" textAlign="center" underline color="white" fontSize={16}>
                              {Localization.auth.signIn.needSigned}
                            </Text>
                          </ButtonComponent>
                        </Box>
                      </Box>
                    );
                  }
              }
        </FormadjoForm>
      </Box>
    </Wrapper>
  );
};
