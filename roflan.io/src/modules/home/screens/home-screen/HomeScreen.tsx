import React, { FC } from 'react';
import { verifyScreenStyle } from '@src/modules/auth/screens/verify-screen/verifyScreen.style.ts';
import { useHomeState } from '@src/modules/home/screens/home-screen/home.state.ts';
import { useNavigation } from '@react-navigation/native';
import { Localization } from '@core/constants/localization.ts';
import { FavouriteIcon, Text } from 'native-base';
import { SVGIcon } from '@components/atoms/icon/Icon.tsx';

const { Wrapper } = verifyScreenStyle;

export const HomeScreen: FC = () => {
  const navigation = useNavigation();
  const { } = useHomeState();
  return (
    <Wrapper>
      <SVGIcon type="noInternet" Img={require('@assets/svg/start-chat.svg')} />
      <Text color="white" fontSize="32" fontWeight="bold">{Localization.hintMessages.startChatting}</Text>
    </Wrapper>
  );
};
