import { FormadjoFormer } from '@core/validators/FormadjoFormer.ts';
import { ISignUpFormTemplate } from '@src/modules/auth/forms/auth.forms.type.ts';
import { FormadjoField } from '@core/validators/Formadjo.ts';
import { MAX_PHONE_LENGTH } from '@components/molecules/phone-input/PhoneInput.tsx';

export const userNameForm = new FormadjoFormer<{ first_name: string; last_name: string; patronymic: string; details: string; sex: string; }>({
  first_name: new FormadjoField('first_name', 'string')
    .setIsRequired(false)
    .setMinLength(2)
    .setMaxLength(40),
  last_name: new FormadjoField('last_name', 'string')
    .setIsRequired(false)
    .setMinLength(2)
    .setMaxLength(40),
  patronymic: new FormadjoField('patronymic', 'string')
    .setIsRequired(false)
    .setMinLength(2)
    .setMaxLength(40),
  details: new FormadjoField('description', 'string')
    .setIsRequired(false)
    .setMinLength(5)
    .setMaxLength(500),
  sex: new FormadjoField('sex', 'string')
    .setIsRequired(false)
    .setMinLength(3)
    .setMaxLength(10),
});

export const userEducationForm = new FormadjoFormer<{ university: string; role: number; }>({
  university: new FormadjoField('university', 'string')
    .setIsRequired(false)
    .setMinLength(2)
    .setMaxLength(40),
  role: new FormadjoField('role', 'number')
    .setIsRequired(false),
});

export const locationInfo = new FormadjoFormer<{ city: string; country: string; }>({
  city: new FormadjoField('city', 'string')
    .setIsRequired(false)
    .setMinLength(2)
    .setMaxLength(40),
  country: new FormadjoField('role', 'string')
    .setIsRequired(false)
    .setMinLength(4)
    .setMaxLength(100),
});

export const otherInfo = new FormadjoFormer<{ active: boolean; }>({
  active: new FormadjoField('active', 'boolean')
    .setIsRequired(false),
});
