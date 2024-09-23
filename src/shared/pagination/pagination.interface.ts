export interface Page {
  pageIndex: number;
  pageSize: number;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  pageSize: number;
  pageIndex: number;
  isFinalPage: boolean;
  lastPage: number;
}
