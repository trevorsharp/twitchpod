export interface StatusWrapper<T> {
  body?: T;
  errorMessage?: string;
  statusCode?: number;
}

export enum Quality {
  Maximum = 0,
  Audio = 1,
  P480 = 2,
  P720 = 3,
}
