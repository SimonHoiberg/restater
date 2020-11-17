import { IAsyncContext, AsyncPayload } from './interfaces/interfaces';
import { useContext } from 'react';

/**
 * Returns an async payload from a store, and a function to update it.
 * @param context
 * @param key
 */
const useAsyncStore = <T, K extends keyof T>(context: React.Context<IAsyncContext<T>>, key: K) => {
  const { store, setStore } = useContext(context);

  const setState = async (
    promiseOrCallback:
      | Promise<T[K]>
      | ((currentValue: { [K in keyof T]: AsyncPayload<T[K]> }[K]) => Promise<T[K]>),
  ) => {
    setStore({ prop: key, payload: { state: 'loading' } });

    try {
      if (typeof promiseOrCallback === 'function') {
        const callback = promiseOrCallback as (
          currentValue: { [K in keyof T]: AsyncPayload<T[K]> }[K],
        ) => Promise<T[K]>;
        const data = await callback(store[key]);
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
    (promise: Promise<T[K]>) => Promise<void>,
  ];
};

export { useAsyncStore };
