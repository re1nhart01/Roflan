import { useCallback } from 'react';
import { Linking } from 'react-native';
import NativeSampleModule from '@tm/NativeSampleModule.ts';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';

export const useWelcomeState = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const goToTermsOfUse = useCallback(async () => {
    const termsEnv = await NativeSampleModule?.getEnv('TERMS_OF_USE');
    if (termsEnv) {
      await Linking.openURL(termsEnv);
    }
  }, []);

  const goToSignIn = useCallback(() => {
    navigation.navigate(Routes.SignInScreen);
  }, [navigation]);

  return {
    goToTermsOfUse,
    goToSignIn,
  };
};
