import { useCallback, useEffect, useRef, useState } from 'react';
import { equals, isNil } from 'ramda';
import { OTPInputForwardProps } from '@components/molecules/react-native-otp-input/OTPInputView.d';
import { Route, useRoute } from '@react-navigation/native';
import { RootStackParams } from '@src/modules/navigation/helpers/Routes.ts';
import { useStoreActions } from '@core/store/store.ts';

export const useVerifyState = () => {
  const {
    params: { phone },
  } = useRoute<Route<string, RootStackParams['VerifyScreen']>>();
  const {
    app: { setIsLoad },
    auth: { setIsAuth },
  } = useStoreActions((state) => state);
  const [code, setCode] = useState('');
  const [isInvalid, setIsInvalid] = useState(true);
  const KEY_CODE_LENGTH = 6;
  const inputRef = useRef<OTPInputForwardProps>(null);
  const handleFieldPress = useCallback(() => {
    if (!isNil(inputRef.current)) {
      inputRef.current?.handleAutoFocus();
    }
  }, []);

  const onCodeConfirm = useCallback(() => {
    setIsLoad(true);

    try {
      setIsAuth(true);
    } catch (e) {
      /* empty */
    } finally {
      setTimeout(() => {
        setIsLoad(false);
      }, 10000);
    }
  }, [setIsAuth, setIsLoad]);

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
    onCodeConfirm,
  };
};
