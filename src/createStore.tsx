import React, { FC, createContext, useReducer } from 'react';
import { IAction, IContext } from './interfaces/interfaces';

/**
 * Creates a new store from a set of initial values.
 * Returns a Provider and a Context in a tuple
 * @param initialStore
 */
const createStore = <IStore extends {}>(
  initialStore: IStore,
): [FC, React.Context<IContext<IStore>>] => {
  const Context = createContext<IContext<IStore>>({
    store: {} as IStore,
    setStore: () => {
      /* placeholder */
    },
  });

  const Provider: FC = ({ children }) => {
    const reducer = createStateReducer<IStore>();
    const [store, setStore] = useReducer(reducer, initialStore);

    return <Context.Provider value={{ store, setStore }}>{children}</Context.Provider>;
  };

  return [Provider, Context];
};

const createStateReducer = <T extends {}>() => (store: T, action: IAction<keyof T, T[keyof T]>) => {
  return { ...store, [action.prop]: action.payload };
};

export { createStore };
