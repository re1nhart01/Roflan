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
import { IUserLocationPrefTemplate } from '@src/modules/home/forms/home.forms.type.ts';
import { FormadjoForm } from '@core/validators/FormadjoForm.tsx';
import { locationInfo } from '@src/modules/home/forms/home.forms.ts';

type userPrefBasicInfoProps = {
    city: string;
    country: string;
    onSubmission: (values: IUserLocationPrefTemplate) => void
};

const { ButtonStyle } = preferencesCommonStyles;

export const UserPrefLocationInfo: FC<userPrefBasicInfoProps> = ({ country, city, onSubmission }) => {
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
      <Accordion title={Localization.components.accordions.locationInfo}>
        <FormadjoForm<IUserLocationPrefTemplate>
          removeErrorOnChange
          form={locationInfo}
          onFinishSubmit={onSubmission}
          initialProps={{
            city,
            country,
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
                  value={values.country}
                  placeholder={Localization.placeholders.country}
                  setText={(v) => updateFormState('country', v)}
                />
                <ErrorMessage errorMessage={errorsList.country.errorMessage} hideIfTextEmpty />
              </Box>
              <Box maxW="750px" pb="8">
                <AnimatedInput
                  maxLength={100}
                  value={values.city}
                  placeholder={Localization.placeholders.city}
                  setText={(v) => updateFormState('city', v)}
                />
                <ErrorMessage errorMessage={errorsList.city.errorMessage} hideIfTextEmpty />
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
