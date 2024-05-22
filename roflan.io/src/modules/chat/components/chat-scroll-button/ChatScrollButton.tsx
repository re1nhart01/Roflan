import { equals } from 'ramda';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { chatScrollButtonStyles } from './chatScrollButton.styles';

const {
  ButtonWrapper,
  ButtonIcon,
  ButtonAnimatedContainer,
  ButtonNewMessagesText,
  ButtonNewMessageWrapper,
} = chatScrollButtonStyles;

const MIN_VALUE = -115;
const MAX_VALUE = 115;

type chatScrollButtonProps = {
  onPress: () => void;
};

export type chatScrollButtonForwardProps = {
  onChangeVisible: (flag: boolean) => void;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  isVisible: boolean;
  updateCounter: () => void;
};

const ChatScrollButton = forwardRef<
  chatScrollButtonForwardProps,
  chatScrollButtonProps
>(({ onPress }, ref) => {
  const [getCounter, setCounter] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const offset = useSharedValue(MAX_VALUE);

  const buttonOffsetStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: offset.value,
      },
    ],
  }));

  const onChangeVisible = useCallback(
    (flag: boolean) => {
      if (isVisible === flag) return;
      setIsVisible(flag);
      setCounter(0);
      const offsetValue = flag ? MIN_VALUE : MAX_VALUE;
      offset.value = withTiming(offsetValue, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });
    },
    [isVisible, offset],
  );

  const updateCounter = useCallback(() => {
    isVisible && setCounter((prev) => prev + 1);
  }, [isVisible]);

  useImperativeHandle(ref, () => ({
    onChangeVisible,
    setCounter,
    isVisible,
    updateCounter,
  }));

  return (
    <ButtonAnimatedContainer style={buttonOffsetStyles}>
      {!equals(getCounter, 0) ? (
        <ButtonNewMessageWrapper pointerEvents="none">
          <ButtonNewMessagesText>{getCounter}</ButtonNewMessagesText>
        </ButtonNewMessageWrapper>
      ) : null}
      <ButtonWrapper onPress={onPress}>
        <ButtonIcon />
      </ButtonWrapper>
    </ButtonAnimatedContainer>
  );
});

export default ChatScrollButton;
