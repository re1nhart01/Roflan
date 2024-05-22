import { useCallback, useState } from 'react';
import { NavigationProp, StackActions, useNavigation } from '@react-navigation/native';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';

export const useSignInState = () => {
  const [phone, setPhone] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const handleGoToSignUp = useCallback(() => {
    navigation.dispatch(StackActions.replace(Routes.SignUpScreen));
  }, [navigation]);

  const handleSignIn = useCallback(() => {
    navigation.navigate(Routes.VerifyScreen, { phone });
  }, [navigation, phone]);

  const handleCopyText = useCallback(async () => {

  }, []);

  return {
    handleSignIn,
    handleGoToSignUp,
    handleCopyText,
    setPhone,
  };
};
