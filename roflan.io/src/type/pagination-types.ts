import type { Action } from "easy-peasy";
import { action } from "easy-peasy";

export interface PaginationFlatListType {
  page: number;
  totalItems: number;
  setPage: Action<this, number>;
  setTotalItems: Action<this, number>;
  isEmptyList: boolean;
  setIsEmptyList: Action<this, boolean>;
}

interface TypedPaginationFlatListType<T> extends PaginationFlatListType {
  setListData: Action<this, T[]>;
  listData: T[];
}

type PrefixKeys<
  T extends string,
  Obj extends Record<string, any>,
  Separator extends string = "_"
> = {
  [K in keyof Obj as K extends string ? `${K}${Separator}${T}` : never]: Obj[K];
};

export type PaginationFlatListFactory<T extends string, S> = PrefixKeys<
  T,
  TypedPaginationFlatListType<S>
>;

export function createPaginationInstance<S, T extends string>(
  postfix: T
): PrefixKeys<T, TypedPaginationFlatListType<S>> {
  return {
    [`page_${postfix}`]: 0,
    [`totalItems_${postfix}`]: 0,
    [`setPage_${postfix}`]: action((state, payload) => {
      (state as never)[`page_${postfix}`] = payload;
    }),
    [`setTotalItems_${postfix}`]: action((state, payload) => {
      (state as never)[`totalItems_${postfix}`] = payload;
    }),
    [`isEmptyList_${postfix}`]: false,
    [`setIsEmptyList_${postfix}`]: action((state, payload) => {
      (state as never)[`isEmptyList_${postfix}`] = payload;
    }),
    [`setListData_${postfix}`]: action((state, payload) => {
      (state as never)[`listData_${postfix}`] = payload;
    }),
    [`list_${postfix}`]: [],
  } as PrefixKeys<T, TypedPaginationFlatListType<S>>;
}
