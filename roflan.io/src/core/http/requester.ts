import axios, { AxiosResponse } from 'axios';
import { equals, isNil } from 'ramda';
import { sleep } from '@core/helpers/functions.ts';
import { store } from '@core/store/store.ts';
import { handleApplicationLogout } from '@core/store/helpers/functions.ts';
import { RefreshTokenResponse } from '@type/definitions.ts';
import { Modules } from '@core/http/misc.ts';
import { tokensCacheStore } from '../caching';
import { APIErrorsResponse, IRequester } from './requester.type';
import NativeCppModule from "@tm/NativeMainModule.ts";

export let promiseTimeoutId: ReturnType<typeof setTimeout> | null = null;
const TIMEOUT45SECOND = 45000;
export const refreshTokenRequest: {
    promise: Promise<AxiosResponse<RefreshTokenResponse>> | null;
    access_token: string | null;
} = {
  promise: null,
  access_token: null,
};

export const requester = async <P, T = unknown>(
  url: IRequester['url'],
  method: IRequester['method'],
  headers?: IRequester['headers'],
  data?: T,
  withRefreshing = true,
  baseURL?: string,
): Promise<AxiosResponse<P>> => {
  const { refresh_token, access_token } = await tokensCacheStore.take();
  try {
    return await axios({
      url: `http://192.168.1.184:8080/api/v2${url}`,
      method,
      data,
      baseURL,
      headers: {
        ...(isNil(headers) ? {} : headers),
        Authorization: `spider$${access_token}`,
      },
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (
        err?.response &&
                equals(err?.response?.status, APIErrorsResponse.invalid_token)
      ) {
        try {
          if (withRefreshing) {
            await requestNewTokens(refresh_token);
            const currentAccessToken = (await tokensCacheStore.take())
              .access_token;
            if (promiseTimeoutId !== null) {
              clearTimeout(promiseTimeoutId);
            }

            promiseTimeoutId = setTimeout(() => {
              refreshTokenRequest.promise = null;
              refreshTokenRequest.access_token = null;
            }, TIMEOUT45SECOND);

            await sleep(1000);

            return axios({
              url: `http://192.168.1.184:8080/api/v2${url}`,
              method,
              data,
              baseURL,
              headers: {
                ...(isNil(headers) ? {} : headers),
                Authorization: `Bearer ${currentAccessToken}`,
              },
              params: { isAfterTokenUpdate: true },
            });
          }
        } catch (errToken) {
          if (axios.isAxiosError(errToken)) {
            if (
              errToken?.response &&
                equals(
                  errToken?.response?.status,
                  APIErrorsResponse.invalid_token,
                )
            ) {
              const storeActions = store.getActions();
              // storeActions.auth.setIsTriggeredFullLogout(true);
              storeActions.auth.setIsAuth(false);
            }
          }
        }
      }
    }
    throw err;
  }
};

async function requestNewTokens(refresh_token: string | null) {
  if (refreshTokenRequest.promise === null) {
    refreshTokenRequest.promise = axios.patch<RefreshTokenResponse>(
      `http://192.168.1.184:8080/api/v2${Modules.auth}/refresh`,
      { refresh_token },
    );
  }
  const { data: refreshData } = await refreshTokenRequest.promise;
  refreshTokenRequest.access_token = refreshData.access_token;
  await tokensCacheStore.getAndSetTokenData(refreshData);
}
