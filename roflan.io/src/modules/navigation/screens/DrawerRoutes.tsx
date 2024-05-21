import React, { FC } from 'react';
import { useStoreState } from '@core/store/store.ts';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';
import { HomeScreen } from '@src/modules/home/screens/home-screen/HomeScreen.tsx';
import { RoflanDrawer } from '@src/modules/navigation/components/drawer/RoflanDrawer.tsx';

const DrawerStack = createDrawerNavigator<RootStackParams>();

export const DrawerRoutes: FC = () => {
  const {
  } = useStoreState((state) => state);

  return (
    <DrawerStack.Navigator
      initialRouteName={Routes.HomeScreen}
      drawerContent={(props) => <RoflanDrawer {...props} />}
      screenOptions={{
        headerShown: true,
      }}
    >
      <DrawerStack.Screen
        name={Routes.HomeScreen}
        component={HomeScreen}
        options={{

        }}
      />
    </DrawerStack.Navigator>
  );
};
