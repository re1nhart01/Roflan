import { NavigationProp, StackActions, useNavigation } from '@react-navigation/native';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';
import { useCallback, useState } from 'react';
import { ISignUpFormTemplate } from '@src/modules/auth/forms/auth.forms.type.ts';
import { InvalidResponseHandler } from '@core/http/respo.ts';
import { Alert, InteractionManager } from 'react-native';
import { useStoreActions } from '@core/store/store.ts';
import { Localization } from '@core/constants/localization.ts';
import { FormadjoAsyncSubmitFn } from '@core/validators/FormadjoForm.tsx';

export const useSignUpState = () => {
  const {
    app: { setIsLoad },
    auth: { registerUser },
  } = useStoreActions((state) => state);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const handleGoToSignUp = useCallback(() => {
    navigation.dispatch(StackActions.replace(Routes.SignInScreen));
  }, [navigation]);

  const handleSignUp: FormadjoAsyncSubmitFn<ISignUpFormTemplate> = useCallback(async (values, addExtendedError) => {
    setIsLoad(true);
    try {
      await registerUser({
        phone: values.phone,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        sex: values.sex,
        role: values.role,
        patronymic: values.patronymic,
        username: values.username,
      });
      Alert.alert('Good!', Localization.info.userRegistered, [
        {
          text: 'Ok',
          onPress: () => {
            navigation.dispatch(StackActions.replace(Routes.SignInScreen));
          },
        },
      ]);
    } catch (e) {
      if (e instanceof InvalidResponseHandler) {
        addExtendedError('phone', { isError: true, errorMessage: e.hint || '' });
      }
    } finally {
      InteractionManager.runAfterInteractions(() => {
        setIsLoad(false);
      });
    }
  }, [navigation, registerUser, setIsLoad]);

  return {
    handleSignUp,
    handleGoToSignUp,
  };
};
