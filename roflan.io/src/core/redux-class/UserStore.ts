import {
  BaseReduxWrapper,
  RRActions,
  RRState,
  RRStore,
  ReduxFactory,
  ReduxMethod, ReduxThunk,
} from '@core/redux-class/BaseReduxWrapper.ts';
import { PayloadAction } from '@reduxjs/toolkit';

@ReduxFactory('user')
export class UserStore extends BaseReduxWrapper {
  public get name(): string {
    return 'user';
  }

  public get initialState() {
    return {
      name: '',
    };
  }

  @ReduxMethod
  public aboba(state: RRState<this>, payload: PayloadAction<{}>): void {
    console.log('brhu', state.name);
    state.name = "zxczczx";
  }

  @ReduxThunk
  public async aba(dispatch: any, actions: any, data: any) {
    console.log(dispatch, actions, data);
    dispatch(actions.aboba());
  }
}
