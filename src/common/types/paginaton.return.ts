export interface paginationReturn<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  searchCount?: boolean;
  pages: number;
}
