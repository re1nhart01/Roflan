import { useCallback, useEffect } from 'react';
import { Linking } from 'react-native';
import NativeCppModule from '@tm/NativeMainModule.ts';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';
import { useStoreActions, useStoreState } from '@core/store/store.ts';

export const useWelcomeState = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const goToTermsOfUse = useCallback(async () => {
    const data = await NativeCppModule.pick();
    console.log(data)
    // const termsEnv = NativeCppModule?.getEnv('TERMS_OF_USE');
    // if (termsEnv) {
    //   await Linking.openURL(termsEnv);
    // }
  }, []);

  const goToSignIn = useCallback(() => {
    navigation.navigate(Routes.SignInScreen);
  }, [navigation]);

  return {
    goToTermsOfUse,
    goToSignIn,
  };
};
