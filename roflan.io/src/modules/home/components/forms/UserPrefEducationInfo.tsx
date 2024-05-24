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
import { IUserEducationPrefTemplate } from '@src/modules/home/forms/home.forms.type.ts';
import { FormadjoForm } from '@core/validators/FormadjoForm.tsx';
import { userEducationForm } from '@src/modules/home/forms/home.forms.ts';
import { Picker } from '@react-native-picker/picker';

type userPrefBasicInfoProps = {
    onSubmission: (values: IUserEducationPrefTemplate) => void
} & IUserEducationPrefTemplate;

const { ButtonStyle } = preferencesCommonStyles;

export const UserPrefEducationInfo: FC<userPrefBasicInfoProps> = ({ university, role, onSubmission }) => {
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
    <Box w="750px" maxH="350px" mb="12">
      <Accordion title={Localization.components.accordions.universityInfo}>
        <FormadjoForm<IUserEducationPrefTemplate>
          removeErrorOnChange
          form={userEducationForm}
          onFinishSubmit={onSubmission}
          initialProps={{
            role,
            university,
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
                <Box pt="2" pb="48">
                  <Box maxW="750px" pb="12" pt="8">
                    <AnimatedInput
                      maxLength={400}
                      value={values.university}
                      placeholder={Localization.placeholders.university}
                      setText={(v) => updateFormState('university', v)}
                    />
                    <ErrorMessage errorMessage={errorsList.university.errorMessage} hideIfTextEmpty />
                  </Box>
                  <Box maxW="750px" pb="8">
                    <Picker
                      selectedValue={values.role}
                      onValueChange={(itemValue) => updateFormState('role', itemValue)}
                    >
                      <Picker.Item label="Graduate" value={1} />
                      <Picker.Item label="Student" value={2} />
                    </Picker>
                    <ErrorMessage errorMessage={errorsList.role.errorMessage} hideIfTextEmpty />
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
