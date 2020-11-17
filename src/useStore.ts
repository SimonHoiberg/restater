import { useContext } from 'react';
import { IContext } from './interfaces/interfaces';

/**
 * Returns a stateful value from a store, and a function to update it.
 * @param context
 * @param key
 */
const useStore = <T, K extends keyof T>(context: React.Context<IContext<T>>, key: K) => {
  const { store, setStore } = useContext(context);
  const state = store[key];

  const setState = (valueOrCallback: T[K] | ((currentValue: T[K]) => T[K])) => {
    if (typeof valueOrCallback === 'function') {
      const callback = valueOrCallback as (currentValue: T[K]) => T[K];
      setStore({ prop: key, payload: callback(state) });
    } else {
      const value = valueOrCallback as T[K];
      setStore({ prop: key, payload: value });
    }
  };

  return [state, setState] as [T[K], (value: T[K] | ((currentValue: T[K]) => T[K])) => void];
};

export { useStore };
