import { useStoreActions, useStoreState } from '@core/store/store.ts';
import { useCallback } from 'react';
import {
  IUserEducationPrefTemplate,
  IUserLocationPrefTemplate,
  IUserNamePrefTemplate,
} from '@src/modules/home/forms/home.forms.type.ts';
import { Alert } from 'react-native';
import { InvalidResponseHandler } from '@core/http/respo.ts';
import { FormadjoAsyncSubmitFn } from '@core/validators/FormadjoForm.tsx';

export const useUserProfileState = () => {
  const {
    user: { updateUserFields },
    app: { setIsLoad },
  } = useStoreActions((state) => state);
  const {
    user: { userData },
  } = useStoreState((state) => state);

  const updateUserField: FormadjoAsyncSubmitFn<IUserNamePrefTemplate
      | IUserLocationPrefTemplate
      | IUserEducationPrefTemplate> = useCallback(async (values, addExtendedError) => {
        setIsLoad(true);
        try {
          await updateUserFields(values);
          // eslint-disable-next-line quotes
          Alert.alert("OK!", "User Info is successfully changed!");
        } catch (e) {
          if (e instanceof InvalidResponseHandler) {
            Alert.alert('Error!', e.unwrap().errorsList?.toString());
          }
          setIsLoad(false);
        } finally {
          setIsLoad(false);
        }
      }, [setIsLoad, updateUserFields]);

  return {
    userData,
    updateUserField,
  };
};
