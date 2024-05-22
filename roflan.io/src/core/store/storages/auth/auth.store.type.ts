import { Action, Thunk } from 'easy-peasy';
import { UserRegisterModel } from '@type/models.ts';

export interface IAuthStore {
    isAuth: boolean;
    setIsAuth: Action<this, this['isAuth']>
    loginUser: Thunk<this, { phone: string; password: string }>;
    registerUser: Thunk<this, UserRegisterModel>;
    validateCode: Thunk<this, { phone: string; code: string }>;
}
