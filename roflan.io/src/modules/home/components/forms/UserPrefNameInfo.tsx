import React, { FC, useCallback } from 'react';
import Accordion from '@components/molecules/accordion/Accordion.tsx';
import { Localization } from '@core/constants/localization.ts';
import { Box, Text } from 'native-base';
import { preferencesCommonStyles } from '@src/modules/home/components/forms/common.styles.ts';
import Clipboard from '@react-native-clipboard/clipboard';
import NativeMainModule from '@tm/NativeMainModule.ts';
import { useThrottle } from '@core/hooks/useThrottle.ts';
import { AnimatedInput } from '@components/molecules/animated-input/AnimatedInput.tsx';
import { ErrorMessage } from '@components/molecules/error-message/ErrorMessage.tsx';
import { IUserNamePrefTemplate } from '@src/modules/home/forms/home.forms.type.ts';
import { FormadjoForm } from '@core/validators/FormadjoForm.tsx';
import { Picker } from '@react-native-picker/picker';
import { userNameForm } from '@src/modules/home/forms/home.forms.ts';

type userPrefBasicInfoProps = {
    onSubmission: (values: IUserNamePrefTemplate) => void
} & IUserNamePrefTemplate;

const { ButtonStyle } = preferencesCommonStyles;

export const UserPrefNameInfo: FC<userPrefBasicInfoProps> = ({ sex, details, patronymic, last_name, first_name, onSubmission }) => {
  const { isThrottle, manageThrottle } = useThrottle();

  const handleCopyText = useCallback(async (v: string) => {
    if (isThrottle.current) {
      return;
    }
    manageThrottle(3000);
    Clipboard.setString(`${v}`);
    await NativeMainModule.showToastNotification('Roflan', Localization.info.copied);
  }, [isThrottle, manageThrottle]);

  return (
    <Box w="750px" maxH="500px" mb="12">
      <Accordion title={Localization.components.accordions.nameInfo}>
        <FormadjoForm<IUserNamePrefTemplate>
          removeErrorOnChange
          form={userNameForm}
          onFinishSubmit={onSubmission}
          initialProps={{
            first_name,
            last_name,
            patronymic,
            sex,
            details,
          }}
        >
          {
                  ({
                    values,
                    onSubmit,
                    updateFormState,
                    errorsList,
                  }) => {
                    return (
                      <Box pb="48">
                        <Box maxW="750px" pb="12" pt="8">
                          <AnimatedInput
                            maxLength={100}
                            value={values.first_name}
                            placeholder={Localization.placeholders.firstName}
                            setText={(v) => updateFormState('first_name', v)}
                          />
                          <ErrorMessage errorMessage={errorsList.first_name.errorMessage} hideIfTextEmpty />
                        </Box>
                        <Box maxW="750px" pb="8">
                          <AnimatedInput
                            maxLength={100}
                            value={values.last_name}
                            placeholder={Localization.placeholders.lastName}
                            setText={(v) => updateFormState('last_name', v)}
                          />
                          <ErrorMessage errorMessage={errorsList.last_name.errorMessage} hideIfTextEmpty />
                        </Box>
                        <Box maxW="750px" pb="8">
                          <AnimatedInput
                            maxLength={100}
                            value={values.patronymic}
                            placeholder={Localization.placeholders.patronymic}
                            setText={(v) => updateFormState('patronymic', v)}
                          />
                          <ErrorMessage errorMessage={errorsList.patronymic.errorMessage} hideIfTextEmpty />
                        </Box>
                        <Box maxW="750px" pb="8">
                          <Picker
                            selectedValue={values.sex}
                            onValueChange={(itemValue) => updateFormState('sex', itemValue)}
                          >
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                            <Picker.Item label="Other" value="other" />
                          </Picker>
                          <ErrorMessage errorMessage={errorsList.sex.errorMessage} hideIfTextEmpty />
                        </Box>
                        <Box maxW="750px" pb="8">
                          <AnimatedInput
                            maxLength={5000}
                            value={values.details}
                            placeholder={Localization.placeholders.description}
                            setText={(v) => updateFormState('details', v)}
                          />
                          <ErrorMessage errorMessage={errorsList.details.errorMessage} hideIfTextEmpty />
                        </Box>
                        <Box>
                          <ButtonStyle onPress={onSubmit}>
                            <Text color="white" fontSize={14}>
                              {Localization.components.change}
                            </Text>
                          </ButtonStyle>
                        </Box>
                      </Box>
                    );
                  }
              }
        </FormadjoForm>
      </Accordion>
    </Box>
  );
};
