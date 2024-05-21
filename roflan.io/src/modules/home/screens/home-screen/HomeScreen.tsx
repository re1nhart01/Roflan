import React, { FC } from 'react';
import { verifyScreenStyle } from '@src/modules/auth/screens/verify-screen/verifyScreen.style.ts';
import { useHomeState } from '@src/modules/home/screens/home-screen/home.state.ts';
import { TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const { Wrapper, Text } = verifyScreenStyle;

export const HomeScreen: FC = () => {
  const navigation = useNavigation();
  const { } = useHomeState();
  const a = 5;
  return (
    <Wrapper>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Text>Bruh</Text>
      </TouchableOpacity>
      <Text>HomeScreen</Text>
    </Wrapper>
  );
};
