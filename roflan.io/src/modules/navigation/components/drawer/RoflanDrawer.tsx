import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList, createDrawerNavigator,
} from '@react-navigation/drawer';
import { useWindowDimensions } from 'react-native';
import { DrawerProps } from '@react-navigation/drawer/lib/typescript/src/types';
import React, { FC } from 'react';
import { TabBar } from '@src/modules/navigation/components/tab-bar/TabBar.tsx';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';
import { roflanDrawerStyle } from '@src/modules/navigation/components/drawer/roflanDrawer.style.ts';

const { DrawerWrapper, OuterBox } = roflanDrawerStyle;

export const RoflanDrawer: FC<DrawerContentComponentProps> = (props) => {
  const width = useWindowDimensions().width * 0.3;
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  return (
    <DrawerWrapper {...props}>
      <OuterBox>
        <DrawerItem
          style={{
            width,
          }}
          label="Home"
          labelStyle={{ color: '#609806' }}
          onPress={() => {
            navigation.navigate(Routes.HomeScreen);
          }}
        />
        <TabBar />
      </OuterBox>
    </DrawerWrapper>
  );
};
