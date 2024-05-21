import { isNil } from 'ramda';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CloseIcon } from 'native-base';
import { animatedInputStyles } from './animatedInput.styles';
import type { animatedInputProps } from './animatedInput.types';
import { animatedInputValues } from './animatedInput.types';

const {
  Wrapper,
  TextInput,
  RightContainer,
  PlaceholderText,
  AnimatedContainer,
} = animatedInputStyles;

export const AnimatedInput: FC<animatedInputProps> = ({
  onFocus,
  onBlur,
  withClearButton,
  setText,
  placeholder,
  value,
  maxLength,
  disabled,
}) => {
  const { dxy, fSize, dSize, fxy, sizeSpeed, xySpeed } = animatedInputValues;
  const offset = useSharedValue(value.length ? fxy : dxy);
  const textSize = useSharedValue(value.length ? fSize : dSize);
  const inputContainerStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: offset.value,
      },
    ],
  }));

  const inputPlaceholderStyles = useAnimatedStyle(() => ({
    fontSize: textSize.value,
  }));

  const handleChangeText = useCallback(
    (v: string) => {
      setText(v);
    },
    [setText],
  );

  const _touchPlaceholder = useCallback(
    (sizeVal: number, offsetVal: number) => {
      textSize.value = withTiming(sizeVal, {
        duration: sizeSpeed,
        easing: Easing.linear,
      });
      offset.value = withTiming(offsetVal, {
        duration: xySpeed,
        easing: Easing.out(Easing.exp),
      });
    },
    [offset, sizeSpeed, textSize, xySpeed],
  );

  const handleOnFocus = useCallback(() => {
    _touchPlaceholder(fSize, fxy);
    onFocus?.();
  }, [_touchPlaceholder, fSize, fxy, onFocus]);

  const handleOnBlur = useCallback(() => {
    if (!isNil(value) && !value.length) {
      _touchPlaceholder(dSize, dxy);
    }
    onBlur?.();
  }, [_touchPlaceholder, dSize, dxy, onBlur, value]);

  return (
    <Wrapper>
      <AnimatedContainer style={inputContainerStyles} topValue={15}>
        <PlaceholderText style={inputPlaceholderStyles}>
          {placeholder}
        </PlaceholderText>
      </AnimatedContainer>
      <TextInput
        editable={!disabled}
        value={value}
        onChangeText={handleChangeText}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        maxLength={maxLength}
      />
      {!disabled && value.length > 0 && withClearButton && (
        <RightContainer onPress={() => setText('')}>
          <CloseIcon />
        </RightContainer>
      )}
    </Wrapper>
  );
};
