# Restater · [![NPM Version](https://img.shields.io/npm/v/restater)](https://www.npmjs.com/package/restater) ![Build Status](https://github.com/Silind-Software/restater/workflows/build/badge.svg)

Tiny hook-based state management tool for React

## Table of content

- [**Getting started**](#getting-started)
- [Usage](#usage)
- [License](#license)
- [Get help](#get-help)
- [Contribute](#contribute)

## Getting started

### Install

With NPM

```console
npm i restater
```

With yarn

```console
yarn add restater
```

## Usage

### Create a store

To create a simple state store, use the `createStore` function from `restater`.

It will return a tuple with a Provider and a StoreContext.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'restater';

// Define the initial state
const initialState = {
  username: 'restater',
  followers: 42,
  isPublic: true,
};

// Create the store
const [Provider, MyStore] = createStore(initialState);

ReactDOM.render(
  // Wrap your component in the Provider
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
);

export { MyStore };
```

### Use the store

In order to use the store, use the `useStore` hook from `restater`.

The `useStore` hook takes a StoreContext and a property-name, and returns a _state_ and a _setState_ tuple, just as `useState`.

```javascript
import React from 'react';
import { useStore } from 'restater';
import { MyStore } from '../index';

const App = () => {
  const [username, setUsername] = useStore(MyStore, 'username');

  return <div>My name is: {username}</div>;
};
```

Updating the username is easy.

```javascript
setUsername('cool-new-username');
```

Any component that is using the username from the store will now get updated, but without affecting any components "in between".

---

### Create an Async Store

A store can also hold async values, and for that, we create a separate kind of store using `createAsyncStore`.  
Again, we provide initial values, but the store will treat these values as promises that needs to be resolved before being set.

Creating the store will work the same as before.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createAsyncStore } from 'restater';

// Define the initial state
const initialState = {
  username: 'restater',
  followers: 42,
  isPublic: true,
};

// Create an *async* store
const [Provider, MyAsyncStore] = createAsyncStore(initialState);

ReactDOM.render(
  // Wrap your component in the Provider
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
);

export { MyAsyncStore };
```

### Use the async store

When we use an Async Store, the _state_ and _setState_ functions behave a little different.  
Instead of `username` containing the value directly, it will contain an object with three properties: `data`, `state`, and `error`.

- `data` contains the value of `username`.
- `state` represents the current state of the promise, and can be either `initial`, `loading`, `failed` or `completed`.
- `error` contains the error that is thrown, if the promise fails.

This enables us to render something conditionally, based on the current state of the store data we want to use.

> Note that `data` will only exist when `state` is either `initial` or `completed`, and `error` will only exist if `state` is `failed`.

```javascript
import React from 'react';
import { useAsyncStore } from 'restater';
import { MyAsyncStore } from '../index';

const App = () => {
  const [username, setUsername] = useAsyncStore(MyAsyncStore, 'username');

  if (username.state === 'initial') {
    return <div>The initial name is: {username.data}</div>;
  }

  if (username.state === 'completed') {
    return <div>My name is: {username.data}</div>;
  }

  if (username.state === 'loading') {
    return <div>Loading ...</div>;
  }

  if (username.state === 'failed') {
    return <div>Something went wrong</div>;
  }
};
```

Because the store is async, the `setUsername` now expects a Promise instead of a raw value.

```javascript
const getUpdatedUsername = async () => {
  const request = await fetch('http://username-api.com');
  const result = await request.json();

  // Result is the new username
  return result;
};

setUsername(getUpdatedUsername());
```

This will cause the `username.state` to go into `loading` in any component that is using the username from the store.  

Note that the `setUsername` itself returns a Promise, so we can await it and do something after the `username.state` has gone into either `completed` or `failed`.  
```javascript
await setUsername(getUpdatedUsername());
// Do something after the username has been updated
```

### Helper functions

To avoid wrapping too many providers in each other, you can use the helper function `combineProviders` which will combine a list of providers into one.  
```javascript
import { combineProviders } from 'restater';

const [Provider1, Context1] = createStore({ /* intital state */ });
const [Provider2, Context2] = createAsyncStore({ /* intital state */ });

// Combine the providers
const Provider = combineProviders([Provider1, Provider2]);

ReactDOM.render(
  // Use the reduced provider and provide access to both stores
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
);
```

## License

This project is licensed under the [MIT License](https://github.com/Silind-Software/restater/blob/master/LICENSE)

## Get Help

- Reach out on [Twitter](https://twitter.com/SimonHoiberg)
- Reach out on [Discord](http://discord.gg/7daE6Ue)
- Open an [issue on GitHub](https://github.com/Silind-Software/restater/issues)

## Contribute

#### Issues

In the case of a bug report, bugfix or a suggestions, please feel very free to open an issue.

#### Pull request

Pull requests are always welcome, and I'll do my best to do reviews as fast as I can.
