import React, { FC } from 'react';
import { verifyScreenStyle } from '@src/modules/auth/screens/verify-screen/verifyScreen.style.ts';
import { useHomeState } from '@src/modules/home/screens/home-screen/home.state.ts';
import { TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {UserRow} from "@components/molecules/user-row/UserRow.tsx";

const { Wrapper, Text } = verifyScreenStyle;

export const CreateChat: FC = () => {
  const navigation = useNavigation();
  const { } = useHomeState();
  const a = 5;
  return (
    <Wrapper>
        <UserRow />
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Text>Bruh</Text>
      </TouchableOpacity>
      <Text>HomeScreen</Text>
    </Wrapper>
  );
};
