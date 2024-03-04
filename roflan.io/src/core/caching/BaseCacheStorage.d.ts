export abstract class BaseCacheStorage<
  Key = unknown,
  Store = unknown,
  Entity = unknown
> {
  protected _store: Store;

  protected _IS_QUEUE_ENABLED: boolean;

  protected abstract _cleanQueue: unknown;

  protected constructor(
    protected limit: number,
    store: Store,
    useQueue?: boolean,
  ) {
    this._store = store;
    this._IS_QUEUE_ENABLED = !!useQueue;
  }

  public updateCleanQueue?(key: Key) {
    console.log('STUB!', key);
  }

  public abstract addItem(key: Key, data: Entity): Promise<void> | void;

  public abstract updateItem(key: Key, data: Entity): Promise<void> | void;

  public abstract getItem(key: Key): Promise<Entity | null> | Entity | null;

  public abstract removeItem(key: Key): Promise<void> | void;
}
