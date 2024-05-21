import React from 'react';
import { Loader } from '@components/molecules/loader/Loader.tsx';
import routesStyle from '@src/modules/navigation/style/routes.style.ts';
import { View } from 'react-native';
import { useStoreState } from '@core/store/store.ts';
import { DrawerRoutes } from '@src/modules/navigation/screens/DrawerRoutes.tsx';
import { AuthRoutes } from '@src/modules/navigation/screens/AuthRoutes.tsx';

const { Container } = routesStyle;

export const RootRoutes = () => {
  const {
    auth: { isAuth },
  } = useStoreState((state) => state);
  return (
    <View accessible={false} focusable={false} importantForAccessibility="no-hide-descendants" style={[Container]}>
      <Loader />
      {isAuth ? <DrawerRoutes /> : <AuthRoutes />}
    </View>
  );
};
