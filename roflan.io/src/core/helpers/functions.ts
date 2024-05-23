import { InvalidResponseHandler } from '@core/http/respo.ts';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const invalidateReact = (k: string, e: any) => {
  const isInvalidHandler = e instanceof InvalidResponseHandler;
  console.log(isInvalidHandler, e.unwrap());
  return { errorMessage: isInvalidHandler ? e.unwrap().errorsList?.phone?.join('') : '', isError: isInvalidHandler };
};

type Model = Record<string, any>;
export const filteredFromActionsModel = (model: Model): Model =>
  Object.fromEntries(
    Object.entries(model).filter(
      ([key, value]) =>
        Object.prototype.toString.call(value) !== '[object Object]',
    ),
  );

export function arrayToDictionary<T>(
  arr: Array<T>,
  k: keyof T,
): { [key: string]: T } {
  const result: { [key: string]: T } = {};
  for (const i of arr) {
    const keyOfObject = i[k];
    result[keyOfObject as string] = i;
  }

  return result;
}
