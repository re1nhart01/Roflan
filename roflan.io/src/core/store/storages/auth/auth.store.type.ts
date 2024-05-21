import { Action } from 'easy-peasy';

export interface IAuthStore {
    isAuth: boolean;
    setIsAuth: Action<this, this['isAuth']>
}
