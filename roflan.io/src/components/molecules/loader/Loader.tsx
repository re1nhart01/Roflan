import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Center } from 'native-base';
import { videos } from '@core/constants/assets.ts';
import { useStoreState } from '@core/store/store.ts';
import { LoaderStyle } from '@components/molecules/loader/loader.style.ts';

const { Wrapper, LoaderGif } = LoaderStyle;

export const Loader = () => {
  const val = useRef(new Animated.Value(1)).current;
  const {
    app: { isLoad },
  } = useStoreState((state) => state);

  useEffect(() => {
    if (isLoad) {
      Animated.timing(val, {
        duration: 500,
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.linear,
      });
    }
  }, [isLoad, val]);

  if (!isLoad) return null;

  return (
    <Wrapper style={[{ opacity: val }]}>
      <Center>
        <LoaderGif
          source={videos.dancingRacoon}
          controls={false}
          repeat
        />
      </Center>
    </Wrapper>
  );
};
