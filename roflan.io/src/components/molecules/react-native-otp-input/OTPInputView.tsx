import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { TextInput } from 'react-native';
import { Keyboard, View } from 'react-native';

import { queueMacrotask } from './helpers';
import type { OTPInputViewProps } from './OTPInputView.d';
import { OTPInputViewStyles } from './OTPInputView.styles';

const {
  FullWidthPressableContainer,
  TouchableInputInnerContainer,
  DefaultTextFieldOTP,
  HiddenTextField,
  InnerField,
} = OTPInputViewStyles;

const OTPInputView = forwardRef(
  (
    {
      codeInputFieldStyle,
      codeInputHighlightStyle,
      secureTextEntry,
      editable,
      selectionColor,
      keyboardAppearance,
      style,
      onCodeChanged,
      pinCount,
      placeholderCharacter,
      placeholderTextColor,
      onCodeFilled,
      onChange,
    }: OTPInputViewProps,
    ref,
  ) => {
    const [currentValue, setCurrentValue] = useState('');
    const hiddenInputRef = useRef<TextInput>(null);

    const notifyCodeChanged = useCallback(
      (digitList: string[] | string) => {
        if (typeof digitList === 'string') {
          onCodeChanged?.(digitList);
          return;
        }
        const codeList = digitList.join('').trim();
        onCodeChanged?.(codeList);
      },
      [onCodeChanged],
    );

    // const subscribeEvent = useCallback(async () => {
    //   if (isIOS) return;
    //   await removeListener();
    //
    //   await startOtpListener((message: string) => {
    //     const otp = /\b\d{6}\b/g.exec(message);
    //     if (!otp) return;
    //     const otpValue = otp[0].trim();
    //     setCurrentValue(otpValue);
    //     notifyCodeChanged(otpValue);
    //     handleBlurHidden();
    //     onCodeFilled?.(otpValue);
    //     queueMacrotask(subscribeEvent);
    //   });
    // }, [notifyCodeChanged, onCodeFilled]);

    const handleChangeHiddenText = (value: string) => {
      setCurrentValue(value);
      onChange(value);
      if (value.length >= pinCount) {
        notifyCodeChanged(value);
        onCodeFilled?.(value);
      }
    };

    useEffect(() => {
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          hiddenInputRef?.current?.blur();
        },
      );

      return () => {
        keyboardDidHideListener.remove();
      };
    }, []);

    const handleBlurHidden = () => {
      hiddenInputRef?.current?.blur();
    };

    const handleFocusHidden = () => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    };

    const renderTextFields = () =>
      Array.from({ length: pinCount }, renderOneInputField);

    useImperativeHandle(ref, () => ({
      handleAutoFocus: handleFocusHidden,
      notifyCodeChanged,
      handleBlurHidden,
    }));

    const renderOneInputField = (_: TextInput, index: number) => (
      <InnerField pointerEvents="none" key={`${index}view`}>
        <DefaultTextFieldOTP
          isSelected={index === currentValue.length}
          codeInputHighlightStyle={codeInputHighlightStyle}
          codeInputFieldStyle={codeInputFieldStyle}
          value={currentValue[index] || ''}
          key={index}
          caretHidden={false}
          editable={false}
          placeholderTextColor={placeholderTextColor}
        />
      </InnerField>
    );

    // useEffect(() => {
    //   try {
    //     subscribeEvent().then();
    //     if (!isIOS) {
    //       getHash().then((hash) => {
    //         sentrySendCustomEvent(
    //           SENTRY_CUSTOM_EVENTS_MESSAGES.otpAutoFillGetHash,
    //           'info',
    //           {
    //             now: new Date().toString(),
    //             hash: hash.join(' '),
    //           },
    //         );
    //       });
    //     }
    //   } catch (e) {
    //     sentrySendCustomEvent(
    //       SENTRY_CUSTOM_EVENTS_MESSAGES.otpAutoFillErrorLog,
    //       'info',
    //       {
    //         now: new Date().toString(),
    //         errorMessage: e,
    //       },
    //     );
    //   }
    // }, [sentrySendCustomEvent, subscribeEvent]);

    return (
      <View style={style}>
        <FullWidthPressableContainer>
          <>
            <HiddenTextField
              keyboardAppearance={keyboardAppearance}
              textContentType="oneTimeCode"
              selectionColor={selectionColor}
              secureTextEntry={secureTextEntry}
              editable={editable}
              placeholder={placeholderCharacter}
              placeholderTextColor={placeholderTextColor}
              keyboardType="number-pad"
              ref={hiddenInputRef as any}
              onChangeText={handleChangeHiddenText}
              value={currentValue}
              maxLength={pinCount}
            />
            <TouchableInputInnerContainer>
              {renderTextFields()}
            </TouchableInputInnerContainer>
          </>
        </FullWidthPressableContainer>
      </View>
    );
  },
);

export { OTPInputView };
