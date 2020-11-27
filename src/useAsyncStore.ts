import { IAsyncContext, AsyncPayload, IAsyncStateOptions } from './interfaces/interfaces';
import { useContext } from 'react';

/**
 * Keep an outer-store reference to avoid capturing pre-render values
 * in the setState function closure.
 */
const outerStore: any = {};

/**
 * Returns an async payload from a store, and a function to update it.
 * @param context
 * @param key
 */
const useAsyncStore = <T, K extends keyof T>(context: React.Context<IAsyncContext<T>>, key: K) => {
  const { store, setStore } = useContext(context);
  outerStore[key] = store[key];

  const setState = async (
    promiseOrCallback:
      | Promise<T[K]>
      | ((currentValue: { [K in keyof T]: T[K] }[K]) => Promise<T[K]>),
    options?: IAsyncStateOptions,
  ) => {
    if (!options?.skipLoading) {
      setStore({ prop: key, payload: { state: 'loading' } });
    }

    try {
      if (typeof promiseOrCallback === 'function') {
        const callback = promiseOrCallback as (
          currentValue: { [K in keyof T]: T[K] }[K],
        ) => Promise<T[K]>;
        const data = await callback(outerStore[key]?.data);
        setStore({ prop: key, payload: { state: 'completed', data } });
      } else {
        const promise = promiseOrCallback as Promise<T[K]>;
        const data = await promise;
        setStore({ prop: key, payload: { state: 'completed', data } });
      }
    } catch (error) {
      setStore({ prop: key, payload: { state: 'failed', error } });
    }
  };

  return [store[key], setState] as [
    { [K in keyof T]: AsyncPayload<T[K]> }[K],
    (
      promiseOrCallback:
        | Promise<T[K]>
        | ((currentValue: { [K in keyof T]: T[K] }[K]) => Promise<T[K]>),
      options?: IAsyncStateOptions | undefined,
    ) => Promise<void>,
  ];
};

export { useAsyncStore };
