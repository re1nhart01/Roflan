import React, { FC, PropsWithChildren, useCallback, useRef } from 'react';
import { Localization } from '@core/constants/localization.ts';
import { Button, IButtonProps } from 'native-base';
import { IButtonComponentType } from 'native-base/lib/typescript/components/primitives/Button/types';
import {Animated, Easing} from 'react-native';

type buttonProps = PropsWithChildren<{
} & IButtonProps>

export const ButtonComponent: FC<buttonProps> = (props) => {
  const fader = useRef(new Animated.Value(1)).current;

  const onHoverIn = useCallback(() => {
    if (props.disabled) return;
    Animated.timing(fader, {
      toValue: 0.2,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, [fader, props.disabled]);

  const onHoverOut = useCallback(() => {
    Animated.timing(fader, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fader }}>
      <Button onHoverIn={onHoverIn} onHoverOut={onHoverOut} {...props}>
        {props.children}
      </Button>
    </Animated.View>
  );
};
