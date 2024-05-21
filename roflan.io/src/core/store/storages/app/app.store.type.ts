import { Action } from 'easy-peasy';

export interface IAppStore {
    isLoad: boolean;
    setIsLoad: Action<this, this['isLoad']>
    isNetworkError: boolean;
    setIsNetworkError: Action<this, this['isNetworkError']>
}
