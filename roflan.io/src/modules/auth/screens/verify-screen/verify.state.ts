import { useCallback, useEffect, useRef, useState } from 'react';
import { equals, isNil } from 'ramda';
import { OTPInputForwardProps } from '@components/molecules/react-native-otp-input/OTPInputView.d';
import { Route, useRoute } from '@react-navigation/native';
import { RootStackParams } from '@src/modules/navigation/helpers/Routes.ts';
import { useStoreActions } from '@core/store/store.ts';
import { InvalidResponseHandler } from '@core/http/respo.ts';

export const useVerifyState = () => {
  const {
    params: { phone },
  } = useRoute<Route<string, RootStackParams['VerifyScreen']>>();
  const {
    app: { setIsLoad },
    auth: { setIsAuth, validateCode },
    user: { getMe, getUsersToCreateChat },
    chats: { getTopics },
  } = useStoreActions((state) => state);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [isInvalid, setIsInvalid] = useState(true);
  const KEY_CODE_LENGTH = 6;
  const inputRef = useRef<OTPInputForwardProps>(null);
  const handleFieldPress = useCallback(() => {
    if (!isNil(inputRef.current)) {
      inputRef.current?.handleAutoFocus();
    }
  }, []);

  const onCodeConfirm = useCallback(async () => {
    setIsLoad(true);
    try {
      await validateCode({
        phone,
        code,
      });
      await Promise.allSettled([getTopics(), getMe(), getUsersToCreateChat()]);
      await Promise.allSettled([]);
    } catch (e) {
      console.log(e instanceof InvalidResponseHandler);
      if (e instanceof InvalidResponseHandler) {
        console.log(e.hint);
        setError(e?.hint || '');
      }
    } finally {
      setTimeout(() => {
        setIsLoad(false);
      }, 2000);
    }
  }, [code, phone, setIsLoad, validateCode]);

  const opacityOfValue = isInvalid ? 0.4 : 1;

  useEffect(() => {
    if (!isNil(inputRef.current)) {
      inputRef.current?.handleAutoFocus();
    }
  }, [inputRef]);

  useEffect(() => {
    const length = code.length;
    if (!equals(length < 6, isInvalid)) {
      setIsInvalid(length < 6);
    }
  }, [code, isInvalid]);

  return {
    code,
    setCode,
    KEY_CODE_LENGTH,
    inputRef,
    handleFieldPress,
    isInvalid,
    opacityOfValue,
    phone,
    error,
    onCodeConfirm,
  };
};
