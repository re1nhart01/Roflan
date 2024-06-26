import React from 'react';
import type { ViewProps } from 'react-native';

import { SVGIcon } from '@components/atoms/icon/Icon';

import { Localization } from '@core/constants/localization.ts';
import { useStoreState } from '@core/store/store.ts';
import { Text } from 'native-base';
import { EmptyScreenStyles } from './emptyScreen.styles';
import type { EmptyScreenProps } from './emptyScreen.types';

const { Wrapper } = EmptyScreenStyles;

export const EmptyScreen = ({
  Img,
  iconType,
  text = '',
  marginTop,
  paddingHorizontal,
  inverted,
  ...props
}: EmptyScreenProps & ViewProps) => {
  const {
    app: { isNetworkError },
  } = useStoreState((state) => state);

  // if list has inverted property, this component will look upside down
  const invertedStyles = inverted
    ? {
      transform: [{ rotate: '180deg' }],
    }
    : {};

  return (
    <Wrapper
      style={invertedStyles}
      paddingHorizontal={paddingHorizontal}
      marginTop={marginTop}
      {...props}
    >
      {iconType && !isNetworkError && text ? (
        <>
          <SVGIcon size={200} width={200} height={200} Img={Img} type={iconType} />
          <Text mt="10" color="white">{text}</Text>
        </>
      ) : (
        <>
          <SVGIcon Img={require('@assets/svg/no-internet.svg')} type="noInternet" color="black" />
          <Text>{Localization.errors.checkConnection}</Text>
        </>
      )}
    </Wrapper>
  );
};
