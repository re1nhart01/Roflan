import React, { FC } from 'react';
import { useStoreState } from '@core/store/store.ts';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';
import { HomeScreen } from '@src/modules/home/screens/home-screen/HomeScreen.tsx';
import { RoflanDrawer } from '@src/modules/navigation/components/drawer/RoflanDrawer.tsx';
import { theme } from 'native-base';
import { UserProfileScreen } from '@src/modules/home/screens/user-profile-screen/UserProfileScreen.tsx';
import { CreateChat } from '@src/modules/home/screens/create-chat-screen/CreateChat.tsx';
import { ChatDM } from '@src/modules/chat/screens/chat-dm/ChatDM.tsx';
import { DEVICE_WIDTH } from '@core/constants/defaults.ts';

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
        drawerStyle: { width: DEVICE_WIDTH - 50 },
        headerStyle: { backgroundColor: theme.colors.darkBlue['800'] },
        headerTitleStyle: { color: theme.colors.white },
      }}
    >
      <DrawerStack.Screen
        name={Routes.HomeScreen}
        component={HomeScreen}
      />
      <DrawerStack.Screen
        name={Routes.UserProfile}
        component={UserProfileScreen}
      />
      <DrawerStack.Screen
        name={Routes.CreateChatScreen}
        component={CreateChat}
      />
      <DrawerStack.Screen
        name={Routes.ChatScreen}
        component={ChatDM}
      />
    </DrawerStack.Navigator>
  );
};
