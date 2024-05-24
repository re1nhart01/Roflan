import React, { FC } from 'react';
import { useSignUpState } from '@src/modules/auth/screens/sign-up-screen/signUp.state.ts';
import { signUpStyle } from '@src/modules/auth/screens/sign-up-screen/signUp.style.ts';
import { Box, CheckIcon, ScrollView, Text } from 'native-base';
import { FormadjoForm } from '@core/validators/FormadjoForm.tsx';
import { ISignUpFormTemplate } from '@src/modules/auth/forms/auth.forms.type.ts';
import { signUpForm } from '@src/modules/auth/forms/auth.forms.ts';
import { Localization } from '@core/constants/localization.ts';
import { AnimatedInput } from '@components/molecules/animated-input/AnimatedInput.tsx';
import { MAX_PHONE_LENGTH } from '@components/molecules/phone-input/PhoneInput.tsx';
import { ErrorMessage } from '@components/molecules/error-message/ErrorMessage.tsx';
import { ButtonComponent } from '@components/atoms/button/Button.tsx';
import { SVGIcon } from '@components/atoms/icon/Icon.tsx';
import { Picker } from '@react-native-picker/picker';

const { Wrapper, ButtonStyle } = signUpStyle;

export const SignUpScreen: FC = () => {
  const { handleGoToSignUp, handleSignUp } = useSignUpState();
  return (
    <Wrapper>
      <Box flex={1} bg="darkBlue.900" justifyContent="center" alignItems="center">
        <ScrollView showsVerticalScrollIndicator={false}>
          <FormadjoForm<ISignUpFormTemplate>
            removeErrorOnChange
            form={signUpForm}
            onFinishSubmit={handleSignUp}
            initialProps={{
              phone: '',
              password: '',
              username: '',
              first_name: '',
              last_name: '',
              patronymic: '',
              sex: '',
              description: '',
              role: 1 }}
          >
            {
            ({
              values,
              onSubmit,
              updateFormState,
              errorsList: {
                phone,
                password,
                username,
                first_name,
                last_name,
                patronymic,
                sex,
                description,
                role,
              },
            }) => {
              return (
                <Box>
                  <Box pt="90px" alignItems="center" />
                  <Text fontWeight="bold" textAlign="center" color="white" fontSize={48}>
                    {Localization.auth.signUp.registration}
                  </Text>
                  <Text mt="4" textAlign="center" fontWeight="semibold" color="white" fontSize={18}>
                    {Localization.auth.signUp.confirm}
                  </Text>
                  <Box pt="80px" alignItems="center" />
                  <Box maxW="750px" pb="12">
                    <AnimatedInput
                      maxLength={MAX_PHONE_LENGTH}
                      value={values.phone}
                      placeholder={Localization.placeholders.phone}
                      setText={(v) => updateFormState('phone', v)}
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
                  <Box maxW="750px" pb="12">
                    <Picker
                      selectedValue={values.role}
                      onValueChange={(itemValue) => updateFormState('role', itemValue)}
                    >
                      <Picker.Item label="Graduate" value={1} />
                      <Picker.Item label="Student" value={2} />
                    </Picker>
                    <ErrorMessage errorMessage={role.errorMessage} hideIfTextEmpty />
                  </Box>
                  <Box maxW="750px" pb="12">
                    <Picker
                      selectedValue={values.sex}
                      onValueChange={(itemValue) => updateFormState('sex', itemValue)}
                    >
                      <Picker.Item label="Male" value="male" />
                      <Picker.Item label="Female" value="female" />
                      <Picker.Item label="Other" value="other" />
                    </Picker>
                    <ErrorMessage errorMessage={sex.errorMessage} hideIfTextEmpty />
                  </Box>
                  <Box maxW="750px" pb="12">
                    <AnimatedInput
                      maxLength={100}
                      value={values.username}
                      placeholder={Localization.placeholders.username}
                      setText={(v) => updateFormState('username', v)}
                    />
                    <ErrorMessage errorMessage={username.errorMessage} hideIfTextEmpty />
                  </Box>
                  <Box maxW="750px" pb="12">
                    <AnimatedInput
                      maxLength={100}
                      value={values.first_name}
                      placeholder={Localization.placeholders.firstName}
                      setText={(v) => updateFormState('first_name', v)}
                    />
                    <ErrorMessage errorMessage={first_name.errorMessage} hideIfTextEmpty />
                  </Box>
                  <Box maxW="750px" pb="12">
                    <AnimatedInput
                      maxLength={100}
                      value={values.last_name}
                      placeholder={Localization.placeholders.lastName}
                      setText={(v) => updateFormState('last_name', v)}
                    />
                    <ErrorMessage errorMessage={last_name.errorMessage} hideIfTextEmpty />
                  </Box>
                  <Box maxW="750px" pb="12">
                    <AnimatedInput
                      maxLength={100}
                      value={values.patronymic}
                      placeholder={Localization.placeholders.patronymic}
                      setText={(v) => updateFormState('patronymic', v)}
                    />
                    <ErrorMessage errorMessage={patronymic.errorMessage} hideIfTextEmpty />
                  </Box>
                  <Box maxW="750px" pb="12">
                    <AnimatedInput
                      maxLength={100}
                      value={values.description}
                      placeholder={Localization.placeholders.description}
                      setText={(v) => updateFormState('description', v)}
                    />
                    <ErrorMessage errorMessage={description.errorMessage} hideIfTextEmpty />
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
        </ScrollView>
      </Box>
    </Wrapper>
  );
};
