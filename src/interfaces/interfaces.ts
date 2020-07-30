export interface IContext<T> {
  store: T;
  setStore: React.Dispatch<IAction<keyof T, T[keyof T]>>;
}

export interface IAction<T, V> {
  prop: T;
  payload: V;
}

export type AsyncState = 'initial' | 'loading' | 'completed' | 'failed';
export type AsyncPayload<V> =
  | { state: 'initial'; data: V }
  | { state: 'completed'; data: V }
  | { state: 'loading' }
  | { state: 'failed' };

export interface IAsyncContext<T> {
  store: { [K in keyof T]: AsyncPayload<T[K]> };
  setStore: React.Dispatch<IAsyncAction<keyof T, T[keyof T]>>;
}

export interface IAsyncAction<T, V> {
  prop: T;
  payload: AsyncPayload<V>;
}
