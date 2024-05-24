import { FormadjoFormer } from '@core/validators/FormadjoFormer.ts';
import { ISignInFormTemplate, ISignUpFormTemplate } from '@src/modules/auth/forms/auth.forms.type.ts';
import { MAX_PHONE_LENGTH } from '@components/molecules/phone-input/PhoneInput.tsx';
import { FormadjoField } from '@core/validators/Formadjo.ts';

export const signInForm = new FormadjoFormer<ISignInFormTemplate>({
  phone: new FormadjoField('phone', 'string')
    .setIsRequired(true)
    .setMinLength(MAX_PHONE_LENGTH)
    .setMaxLength(MAX_PHONE_LENGTH + 1),
  password: new FormadjoField('password', 'string')
    .setIsRequired(true)
    .setMinLength(5)
    .setMaxLength(100),
});

export const signUpForm = new FormadjoFormer<ISignUpFormTemplate>({
  username: new FormadjoField('username', 'string')
    .setIsRequired(true)
    .setMinLength(3)
    .setMaxLength(40),
  phone: new FormadjoField('phone', 'string')
    .setIsRequired(true)
    .setMinLength(MAX_PHONE_LENGTH)
    .setMaxLength(MAX_PHONE_LENGTH + 1),
  password: new FormadjoField('password', 'string')
    .setIsRequired(true)
    .setMinLength(5)
    .setMaxLength(100),
  description: new FormadjoField('description', 'string')
    .setIsRequired(true)
    .setMinLength(5)
    .setMaxLength(500),
  role: new FormadjoField('role', 'number')
    .setIsRequired(true),
  first_name: new FormadjoField('first_name', 'string')
    .setIsRequired(true)
    .setMinLength(2)
    .setMaxLength(40),
  last_name: new FormadjoField('last_name', 'string')
    .setIsRequired(true)
    .setMinLength(2)
    .setMaxLength(40),
  patronymic: new FormadjoField('patronymic', 'string')
    .setIsRequired(true)
    .setMinLength(2)
    .setMaxLength(40),
  sex: new FormadjoField('sex', 'string')
    .setIsRequired(true),
});
