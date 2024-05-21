export class Respo<T> {
  private __DATA__: T;

  constructor(fromApi: any) {
    this.__DATA__ = fromApi;
  }

  public unwrap() {

  }
}
