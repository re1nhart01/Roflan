import { Localization } from '@core/constants/localization.ts';

export type handler = {
  data: {
    statusCode: number;
    message: string;
    hint: string;
    data?: GoDTOError[];
  }
}

export type GoDTOError = {
    field_name: string;
    error_msg: string[]
}

export class InvalidResponseHandler {
  private __DATA__: handler;

  public hint: string;

  constructor(fromApi: handler) {
    this.__DATA__ = fromApi;
    this.hint = fromApi.data.hint || '';
  }

  private transformToPrimaryForm(errors: GoDTOError[]) {
    const result: { [key: string]: string[] } = {};
    errors.forEach((currentValue) => {
      result[currentValue.field_name] = currentValue.error_msg;
    }, {} as { [key: string]: string[] });
    return result;
  }

  public unwrap() {
    const formedErrors = this.__DATA__.data ? this.transformToPrimaryForm(this.__DATA__.data as any) : null;
    return {
      errorsList: formedErrors,
      hint: this.__DATA__.data?.hint || Localization.errors.unexpectedError,
    };
  }
}
