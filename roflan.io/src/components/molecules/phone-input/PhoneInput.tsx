import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  validatePhoneNumberLength,
} from 'libphonenumber-js';
import { isNil } from 'ramda';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TextInput } from 'react-native';

import { UKR_PHONE_CODE } from '@core/constants/defaults.ts';
import { Localization } from '@core/constants/localization.ts';
import { PhoneInputStyles } from './phoneInput.styles';

interface PhoneInputProps {
  phoneValue: string;
  onSubmitEditing?: () => void;
  setIsError: (is: boolean) => void;
  setErrorMessage: (error: string) => void;
  onChangeText: (phone: string) => void;
  onEndEditing?: () => void;
  autoFocus?: boolean;
}

const { Wrapper, PhoneText, PhoneTextInput } = PhoneInputStyles;

export const MAX_PHONE_LENGTH = 13;
export const phoneTemplate = '+38000000000';
export const PhoneInput = ({
  phoneValue,
  onChangeText,
  setErrorMessage,
  setIsError,
  onEndEditing,
  autoFocus,
}: PhoneInputProps) => {
  const { t } = useTranslation();
  const [phoneToDisplay, setPhoneToDisplay] = useState('');
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    setPhoneToDisplay(phoneValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatPhoneNumber = (number: string) => {
    if (number.length <= 2) {
      return number;
    } if (number.length <= 5) {
      return `${number.slice(0, 2)} ${number.slice(2)}`;
    } if (number.length > 5) {
      return `${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`;
    }
    return `${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`;
  };

  const handlePhoneNumer = (phone: string) => {
    phone = phone.split(' ').join('');
    onChangeText(phone);
    setPhoneToDisplay(phone);
  };

  const formattedPhoneNumber = formatPhoneNumber(phoneToDisplay);

  const onFocusInput = useCallback(() => {
    if (!isNil(inputRef.current)) {
      inputRef.current?.focus();
    }
  }, [inputRef]);

  const handleBlurOnSubmit = useCallback(() => {
    const phoneWithCountry = `+380${phoneValue}`;
    if (
      isPossiblePhoneNumber(phoneWithCountry, 'UA') &&
      isValidPhoneNumber(phoneWithCountry, 'UA') &&
      !validatePhoneNumberLength(phoneWithCountry, 'UA')
    ) {
      setIsError(false);
      setErrorMessage('');
    } else {
      setIsError(true);
      setErrorMessage(Localization.errors.uncorrectNumber);
    }
  }, [phoneValue, setErrorMessage, setIsError, t]);

  return (
    <Wrapper onPress={onFocusInput}>
      <PhoneText>{UKR_PHONE_CODE}</PhoneText>
      <PhoneTextInput
        ref={inputRef}
        autoFocus={autoFocus}
        onEndEditing={onEndEditing}
        onSubmitEditing={handleBlurOnSubmit}
        onChangeText={handlePhoneNumer}
        hitSlop={{ bottom: 50, top: 50, left: 50, right: 50 }}
        value={formattedPhoneNumber}
        maxLength={MAX_PHONE_LENGTH}
        keyboardType="phone-pad"
      />
    </Wrapper>
  );
};
