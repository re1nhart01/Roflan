import { RAction, RState, RThunk, ThunkSh } from '../../redux-class/base';

export interface IUserStore {
    get initialState(): RState<{
        name: string;
    }>
    setName: RAction<this['initialState'], { k: string }>;
    dispatchName: RThunk<{ k: string }, this, { boo: boolean }>
}

export interface IUserThunks {
    dispatchName: ThunkSh<{ k: string }, { boo: boolean }>;
}
