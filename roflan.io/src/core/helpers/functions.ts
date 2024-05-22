import { InvalidResponseHandler } from '@core/http/respo.ts';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const invalidateReact = (k: string, e: any) => {
  const isInvalidHandler = e instanceof InvalidResponseHandler;
  console.log(isInvalidHandler, e.unwrap());
  return { errorMessage: isInvalidHandler ? e.unwrap().errorsList?.phone?.join('') : '', isError: isInvalidHandler };
};
