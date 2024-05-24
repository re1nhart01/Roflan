import axios from 'axios';
import { RefreshTokenResponse } from '@type/definitions.ts';
import { tokensCacheStore } from '@core/caching';
import { isNil } from 'ramda';
import { handleApplicationLogout } from '@core/store/helpers/functions.ts';

export enum Modules {
    auth = '/auth',
    user = '/users',
}

export class Misc {
  public static async refreshTokens() {
    const { refresh_token } = await tokensCacheStore.take();
    if (isNil(refresh_token)) {
      await handleApplicationLogout();
      return;
    }
    const data = await axios.patch<RefreshTokenResponse>(`${Modules.auth}/refresh`, { refresh_token });
  }
}
