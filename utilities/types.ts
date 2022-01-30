export interface StatusWrapper<T> {
  body?: T;
  errorMessage?: string;
  statusCode?: number;
}
