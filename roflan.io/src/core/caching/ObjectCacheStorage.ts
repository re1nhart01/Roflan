import { defaultTo, isNil } from 'ramda';

import { BaseCacheStorage } from './BaseCacheStorage.d';

const MAX_LIMIT = 1000;

export class ObjectCacheStorage<
  Key,
  Data extends object
> extends BaseCacheStorage<Key, Map<Key, Data>, Data> {
  protected override _cleanQueue: Map<Key, number>;

  constructor(useQueue: boolean, limit?: number) {
    super(limit || MAX_LIMIT, new Map<Key, Data>(), useQueue);
    this._cleanQueue = new Map<Key, number>();
  }

  public override addItem(key: Key, data: Data): void {
    if (this._IS_QUEUE_ENABLED) {
      if (this._store.size >= this.limit) {
        let smallestKey: Key | null = null;
        let smallestValue = Infinity;
        let biggestValue = 0;
        this._cleanQueue.forEach((v, k) => {
          if (smallestValue > v) {
            smallestKey = k;
            smallestValue = v;
          }
          if (biggestValue < v) {
            biggestValue = v;
          }
        });
        if (smallestKey) {
          this._cleanQueue.delete(smallestKey);
          this._cleanQueue.set(key, Math.max(biggestValue - 2, 2));
        }
      } else {
        this.updateCleanQueue(key);
      }
    } else if (this._store.size >= this.limit) {
      this._store.clear();
    }

    if (!this._store.has(key)) {
      this._store.set(key, data);
    }
  }

  public override updateCleanQueue(key: Key) {
    if (this._cleanQueue.has(key)) {
      const instance = this._cleanQueue.get(key);
      if (!isNil(instance)) this._cleanQueue.set(key, instance + 1);
    } else {
      this._cleanQueue.set(key, 1);
    }
  }

  public override updateItem(key: Key, data: Data): void {
    if (this._store.has(key)) {
      this._store.set(key, data);
    } else {
      this.addItem(key, data);
    }
  }

  public override getItem(key: Key): Data | null {
    if (this._IS_QUEUE_ENABLED) {
      this.updateCleanQueue(key);
    }
    return defaultTo(null, this._store.get(key));
  }

  public override removeItem(key: Key): void {
    if (this._store.has(key)) {
      this._store.delete(key);
    }
  }
}
