import { IAsyncContext, AsyncPayload } from './interfaces/interfaces';
import { useContext } from 'react';

/**
 * Returns an async payload from a store, and a function to update it.
 * @param context 
 * @param key 
 */
const useAsyncStore = <T, K extends keyof T>(context: React.Context<IAsyncContext<T>>, key: K) => {
  const { store, setStore } = useContext(context);
  const state = store[key];

  const setState = async (promise: Promise<T[K]>) => {
    setStore({ prop: key, payload: { state: 'loading' } });

    try {
      const data = await promise;
      setStore({ prop: key, payload: { state: 'completed', data } });
    } catch (error) {
      setStore({ prop: key, payload: { state: 'failed' } });
    }
  };

  return [state, setState] as [
    { [K in keyof T]: AsyncPayload<T[K]> }[K],
    (promise: Promise<T[K]>) => Promise<void>,
  ];
};

export { useAsyncStore };
