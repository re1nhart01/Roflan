import { CommonActions, NavigationProp, StackActions, useNavigation } from '@react-navigation/native';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';
import { useCallback, useState } from 'react';

export const useSignUpState = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const handleGoToSignUp = useCallback(() => {
    navigation.dispatch(StackActions.replace(Routes.SignInScreen));
  }, [navigation]);

  const handleSignUp = useCallback(() => {
  }, []);

  return {
    handleSignUp,
    handleGoToSignUp,
  };
};
