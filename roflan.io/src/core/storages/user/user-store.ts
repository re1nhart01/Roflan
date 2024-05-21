import {Dispatch, PayloadAction} from '@reduxjs/toolkit';
import { ReduxFactory, ReduxMethod, ReduxThunk } from '@core/redux-class/base/decorator.ts';
import { Wrapper } from '@core/redux-class/base/wrapper.ts';
import {RRActions, RRState} from '@core/redux-class/base';
import { RAction, RState, RThunk } from '../../redux-class/base';

@ReduxFactory('user')
export class UserStore extends Wrapper {
  public get name(): string {
    return 'user';
  }

  public get initialState() {
    return {
      name: '',
    };
  }

  @ReduxMethod
  public setName(state: RState<this['initialState']>, payload: { k: string }) {
    console.log('brhu', state.name);
    state.name = 'zxczczx';
  }

  @ReduxThunk
  public async dispatchName(dispatch: Dispatch, actions: RRActions<typeof this>, data: { d: boolean }) {
    console.log(dispatch, actions, data);
    dispatch(actions.setName({ n: true }));
  }
}
