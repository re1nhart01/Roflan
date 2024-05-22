import axios, { AxiosRequestHeaders } from 'axios';
import { tokensCacheStore } from '@core/caching';
import { assoc, defaultTo, equals, isNil, pipe } from 'ramda';
import NativeCppModule from '@tm/NativeMainModule.ts';
import { APIErrorsResponse } from '@core/http/requester.type.ts';
import { store } from '@core/store/store.ts';
import { handleApplicationLogout } from '@core/store/helpers/functions.ts';

let counterToLogout = 0;
const maxCountToLogout = 15;

type AxiosCustomHeaderType = Record<'Authorization', string> &
    Omit<
        Record<'Content-Type', string | RegExpExecArray> &
        Omit<AxiosRequestHeaders, 'Content-Type'>,
        'Authorization'
    >;

export const newAbortSignal = (timeoutMs: number) => {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeoutMs || 0);
  return abortController.signal;
};

axios.interceptors.request.use(
  async (config) => {
    const { access_token } = await tokensCacheStore.take();
    if (access_token && isNil(config.headers?.Authorization)) {
      (<AxiosCustomHeaderType>config.headers) = pipe(
        assoc(
          'Content-Type',
          defaultTo('application/json', config.headers?.getContentType?.()),
        ),
        assoc('Authorization', `Bearer ${access_token}`),
      )(config.headers);
    }

    return assoc(
      'signal',
      defaultTo(newAbortSignal(15000), config.signal),
      config,
    );
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => {
    counterToLogout = 0;
    return response;
  },
  (error) => {
    const storeActions = store.getActions();
    console.error({ error });

    if (equals(error.message, APIErrorsResponse.abortingError)) {
      storeActions.app.setIsNetworkError(true);
    }

    if (equals(error.message, APIErrorsResponse.networkError)) {
      storeActions.app.setIsNetworkError(true);
    }

    if (equals(error?.response?.status, APIErrorsResponse.inactivate_user)) {

    }

    if (
      error?.config.params?.isAfterTokenUpdate &&
            equals(error?.response?.status, APIErrorsResponse.invalid_token)
    ) {
      counterToLogout++;
      if (counterToLogout >= maxCountToLogout) {
        handleApplicationLogout().then();
      }
    }

    return Promise.reject(error);
  },
);
