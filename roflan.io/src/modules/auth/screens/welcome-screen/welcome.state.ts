import { useCallback, useEffect } from 'react';
import { Linking } from 'react-native';
import NativeSampleModule from '@tm/NativeSampleModule.ts';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';
import { useStoreActions, useStoreState } from '@core/store/store.ts';

export const useWelcomeState = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {
    auth: { setIsAuth },
  } = useStoreActions((state) => state);
  const {
    auth: { isAuth },
  } = useStoreState((state) => {
    console.log(state);
    return state;
  });
  const goToTermsOfUse = useCallback(async () => {
    const termsEnv = await NativeSampleModule?.getEnv('TERMS_OF_USE');
    if (termsEnv) {
      await Linking.openURL(termsEnv);
    }
  }, []);

  const goToSignIn = useCallback(() => {
    navigation.navigate(Routes.SignInScreen);
  }, [navigation]);

  useEffect(() => {
    setIsAuth(false);
  }, [setIsAuth]);

  return {
    goToTermsOfUse,
    goToSignIn,
  };
};
