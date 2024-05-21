import React, { FC } from 'react';
import { useStoreState } from '@core/store/store.ts';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';
import { WelcomeScreen } from '@src/modules/auth/screens/welcome-screen/WelcomeScreen.tsx';
import { SignInScreen } from '@src/modules/auth/screens/sign-in-screen/SignInScreen.tsx';
import { SignUpScreen } from '@src/modules/auth/screens/sign-up-screen/SignUpScreen.tsx';

const AuthStack = createNativeStackNavigator<RootStackParams>();

export const AuthRoutes: FC = () => {
  const {
  } = useStoreState((state) => state);

  return (
    <AuthStack.Navigator
      initialRouteName={Routes.WelcomeScreen}
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen
        name={Routes.WelcomeScreen}
        component={WelcomeScreen}
        options={{

        }}
      />
      <AuthStack.Screen
        name={Routes.SignInScreen}
        component={SignInScreen}
        options={{

        }}
      />
      <AuthStack.Screen
        name={Routes.SignUpScreen}
        component={SignUpScreen}
        options={{

        }}
      />
      <AuthStack.Screen
        name={Routes.VerifyScreen}
        component={SignInScreen}
        options={{

        }}
      />
    </AuthStack.Navigator>
  );
};
