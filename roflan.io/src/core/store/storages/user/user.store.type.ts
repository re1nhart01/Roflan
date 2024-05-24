import { Action, Thunk } from 'easy-peasy';
import { UserModelMe } from '@type/models.ts';

export interface IUserStore {
    userList: UserModelMe[];
    userData: UserModelMe | null;
    updatableUserData: UserModelMe | null;
    setUserList: Action<this, this['userList']>
    setUserData: Action<this, this['userData']>
    setUpdatableUserData: Action<this, this['updatableUserData']>
    updateUserFields: Thunk<this, Partial<Omit<UserModelMe, 'phone' | 'username'>>>
    getMe: Thunk<this>;
    getUsersToCreateChat: Thunk<this>;
    reset: Action<this>;
}
