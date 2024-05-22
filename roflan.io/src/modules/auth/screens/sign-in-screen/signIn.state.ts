import { useCallback, useState } from 'react';
import { NavigationProp, StackActions, useNavigation } from '@react-navigation/native';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';
import Clipboard from '@react-native-clipboard/clipboard';
import { MAX_PHONE_LENGTH, phoneTemplate } from '@components/molecules/phone-input/PhoneInput.tsx';
import NativeMainModule from '@tm/NativeMainModule.ts';
import { Localization } from '@core/constants/localization.ts';
import { useThrottle } from '@core/hooks/useThrottle.ts';
import { useStoreActions } from '@core/store/store.ts';
import { InteractionManager } from 'react-native';
import { FormadjoAsyncSubmitFn } from '@core/validators/FormadjoForm.tsx';
import { InvalidResponseHandler } from '@core/http/respo.ts';

export const useSignInState = () => {
  const {
    app: { setIsLoad },
    auth: { loginUser },
  } = useStoreActions((state) => state);
  const [phone, setPhone] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { isThrottle, manageThrottle } = useThrottle();
  const handleGoToSignUp = useCallback(() => {
    navigation.dispatch(StackActions.replace(Routes.SignUpScreen));
  }, [navigation]);

  const handleSignIn: FormadjoAsyncSubmitFn<{ phone: string; password: string; }> = useCallback(async (values, addExtendedError) => {
    setIsLoad(true);
    try {
      await loginUser({
        phone: values.phone,
        password: values.password,
      });
      navigation.navigate(Routes.VerifyScreen, { phone });
    } catch (e) {
      if (e instanceof InvalidResponseHandler) {
        addExtendedError('phone', { isError: true, errorMessage: e.hint || '' });
      }
    } finally {
      InteractionManager.runAfterInteractions(() => {
        setIsLoad(false);
      });
    }
  }, [loginUser, navigation, phone, setIsLoad]);

  const handleCopyText = useCallback(async () => {
    const correctPhone = phone.length >= MAX_PHONE_LENGTH ? phone.length : phoneTemplate;
    // register +38000000000
    if (isThrottle.current) {
      return;
    }
    manageThrottle(3000);
    Clipboard.setString(`/register ${correctPhone}`);
    await NativeMainModule.showToastNotification('Roflan', Localization.info.copied);
  }, [isThrottle, manageThrottle, phone.length]);

  return {
    handleSignIn,
    handleGoToSignUp,
    handleCopyText,
    setPhone,
  };
};
