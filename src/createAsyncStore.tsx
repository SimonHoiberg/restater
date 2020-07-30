import React, { FC, createContext, useReducer } from 'react';
import { IAsyncAction, IAsyncContext, AsyncPayload } from './interfaces/interfaces';

/**
 * Creates a new async store from a set of initial values.
 * Returns a Provider and a Context in a tuple
 * @param initialStore
 */
const createAsyncStore = <IStore extends {}>(
  initialStore: IStore,
): [FC, React.Context<IAsyncContext<IStore>>] => {
  const Context = createContext<IAsyncContext<IStore>>({
    store: {} as any,
    setStore: () => {
      /* placeholder */
    },
  });

  const Provider: FC = ({ children }) => {
    const asyncInitialStore = Object.entries(initialStore).reduce((obj, [key, value]) => {
      return {
        ...obj,
        [key]: {
          state: 'initial',
          data: value,
        },
      };
    }, {}) as { [K in keyof IStore]: AsyncPayload<IStore[K]> };

    const reducer = createStateReducer<IStore>();
    const [store, setStore] = useReducer(reducer, asyncInitialStore);

    return <Context.Provider value={{ store, setStore }}>{children}</Context.Provider>;
  };

  return [Provider, Context];
};

const createStateReducer = <T extends {}>() => (
  store: { [K in keyof T]: AsyncPayload<T[K]> },
  action: IAsyncAction<keyof T, T[keyof T]>,
) => {
  return { ...store, [action.prop]: action.payload };
};

export { createAsyncStore };
