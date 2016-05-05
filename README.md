# ng2-redux
Angular 2 bindings for [Redux](https://github.com/reactjs/redux).

For Angular 1 see [ng-redux](https://github.com/wbuchwalter/ng-redux)

[![Circle CI](https://circleci.com/gh/angular-redux/ng2-redux/tree/master.svg?style=svg)](https://circleci.com/gh/angular-redux/ng2-redux/tree/master)
[![npm version](https://img.shields.io/npm/v/ng2-redux.svg?style=flat-square)](https://www.npmjs.com/package/ng2-redux)

ng2-redux lets you easily connect your Angular 2 components with Redux.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Cookbooks](#cookbooks)
  - [Using Angular 2 Services in your Action Creators](#using-angular-2-services-in-your-action-creators)
  - [Using Angular 2 Services in your Middleware](#using-angular-2-services-in-your-middleware)
  - [Using Redux DevTools](#using-devtools)
- [API](#api)

## Installation

```sh
npm install --save ng2-redux
```

## Quick Start

### Initialization

Import the `NgRedux` class and add it to your application as an Angular 2
provider.

```typescript
import {bootstrap} from '@angular/platform-browser-dynamic';
import { App } from './containers/App';

bootstrap(App, [ NgRedux ]);
```

Once you've done this, you'll be able to inject 'NgRedux' into your
Angular 2 components. In your top-level app component, you
can configure your Redux store with reducers, initiali state, 
and optionally middlewares and enhancers as you would in Redux directly.

```typescript
import { NgRedux } from 'ng2-redux';
const thunk = require('redux-thunk').default;
import { rootReducer } from './reducers';

interface IAppState {
  // ...   
};
@Component({
  // ... etc.
})
class App {
  constructor(private ngRedux: NgRedux) {
    this.ngRedux.configureSture(rootReducer, {}, [ thunk ]);
  }

  // ...
}
```

Now your Angular 2 app has been reduxified!

## Usage

`ng2-redux` has two main usage patterns: the `select` pattern and the `connect` pattern.

### The Select Pattern

This is the preferred approach for Angular 2, since it uses Observables to interface
more cleanly with common Angular 2 usage patterns.

In this approach, we use `ngRedux.select()` to get observables from slices of our store
state:

```typescript
import { Component} from '@angular2/core';
import { Observable} from 'rxjs';
import { AsyncPipe} from '@angular2/common';
import { Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import { NgRedux} from 'ng2-redux';

interface IAppState {
  counter: number;
};

@Component({
    selector: 'root',
    directives: [Counter],
    pipes: [AsyncPipe],
    template: `
  <counter [counter]="counter$| async"
    [increment]="increment"
    [decrement]="decrement">
  </counter>
  `
})
export class Counter {
  private count$: Observable<number>;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  ngOnInit() {
    let {increment, decrement } = CounterActions;
    this.counter$ = this.ngRedux.select('counter');
  }

  incrementIfOdd = () => this.ngRedux.dispatch(
    <any>CounterActions.incrementIfOdd());

  incrementAsync = () => this.ngRedux.dispatch(
    <any>CounterActions.incrementAsync());
}
```

`ngRedux.select` can take a property name or a function which transforms a property.
Since it's an observable, you can also transform data using observable operators like
`.map`, `.filter`, etc.

### The Connect Pattern

Alternately you can use the 'ngRedux.connect' API, which will map your state and action creators
to the component class directly.

This pattern is provided for backwards compatibility. It's worth noting that
Angular 2's view layer is more optimized for Observables and the `select`
pattern above.

```typescript
import { Component } from '@angular/core';
import { Counter } from '../components/Counter';
import { NgRedux } from 'ng2-redux';
import { bindActionCreators } from 'redux';

export interface IAppState {
  counter: number;
};

// NB: 'import * as CounterActions' won't provide the right type
// for bindActionCreators.
const CounterActions = require('../actions/CounterActions');

@Component({
    selector: 'root',
    directives: [Counter],
    template: `
  <counter [counter]="counter"
    [increment]="actions.increment"
    [decrement]="actions.decrement">
  </counter>
  `
})
export class Counter {
  private count$: Observable<number>;

  mapStateToTarget(state) {
    return { counter: state.counter };
  }

  ngOnDestroy() {
    this.disconnect();
  }

  // Will result in this.counter being set to the store value of counter
  // after each change.
  mapStateToTarget(state) {
    return { counter: state.counter };
  }

  // Will result in a method being created on the component for each
  // action creator, which dispatches to the store when called.
  mapDispatchToThis(dispatch) {
    return { actions: bindActionCreators(CounterActions, dispatch) };
  }
}
```

## Cookbooks

### Using Angular 2 Services in your Action Creators

In order to use services in your action creators, you need to integrate
them into Angular 2's dependency injector.

This means attaching your action creators to a class so that:

1. you can make it `@Injectable()`, and
2. you can inject other services into its constructor for your
action creators to use.

Take a look at this example, which uses
* [redux-thunk](https://github.com/gaearon/redux-thunk) to
allow for asynchronous actions, and
* Angular 2's `http` service to make auth requests.

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import {
  LOGIN_USER_PENDING,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGOUT_USER
} from '../constants';

// Wrap our action creators in a class and make it @Injectable.
// Don't forget to add it to your app's `providers`.
@Injectable()
export class SessionActions {
  constructor(private http: Http) {}

  // Here's an action creator that uses HTTP.
  loginUser(credentials) {
    return (dispatch, getState) => {
      dispatch({type: LOGIN_USER_PENDING});

      this.http.post('/auth/login', credentials)
        .toPromise()
        .then(response => dispatch({type: LOGIN_USER_SUCCESS, payload: response.json()})
        .catch(error => dispatch({type: LOGIN_USER_ERROR, payload: error, error: true });
      });
    };
  }

  // Just a regular, synchronous action creator.
  logoutUser() {
    return { type: LOGOUT_USER };
  }
}
```

To use these action creators, we can just go ahead an map them
to our container component:

```typescript
import { Component } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { SessionActions } from '../actions/session';
import { IAppState } from './app-state';

@Component({
  // ... etc.
})
export class LoginPage {
  // Here we inject the SessionActions instance into our
  // smart component.
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private sessionActions: SessionActions) {
  }

  login(credentials) {
    this.ngRedux.dispatch(
      <any>this.sessionActions.loginUser(credentials));
  }

  logout() {
    this.ngRedux.dispatch(this.sessionActions.logoutUser());
  }
};
```

### Using Angular 2 Services in your Middleware

Again, we just want to use Angular DI the way it was meant to be used.

Here's a contrived example that fetches a name from a remote API using Angular's
`Http` service:

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LogRemoteName {
  constructor(private http: Http) {}

  middleware = store => next => action => {
    console.log('getting user name');
    this.http.get('http://jsonplaceholder.typicode.com/users/1')
      .toPromise()
      .then(response => {
        console.log('got name:', response.json().name);
        return next(action);
      })
      .catch(err => console.log('get name failed:', err));
    }
}
```

As with the action example above, we've attached our middleware function to
an `@Injectable` class that can itself receive services from Angular's dependency
injector.

Note the arrow function called `middleware`: this is what we can pass to the middlewares
parameter when we initialize ngRedux in our top-level component. We use an arrow function
to make sure that what we pass to ngRedux has a properly-bound function context.

```typescript
import { LogRemoteName } from './middleware/log-remote-name';
const thunk = require('redux-thunk').default;
const reduxLogger = require('redux-logger');

@Component({
  providers: [ LogRemoteName ],
  // ...
})
class App {
  constructor(
    private ngRedux: NgRedux
    logRemoteName: LogRemoteName) {

    const middleware = [ thunk, reduxLogger(), logRemoteName.middleware ];
    this.ngRedux.configureStore(
      rootReducer,
      initialState,
      middleware);
  }
}
```

### Using DevTools

Ng2Redux is fully compatible with the Chrome extension version of the Redux dev tools:

https://github.com/zalmoxisus/redux-devtools-extension

Here's how to enable them in your app (you probably only want to do
this in development mode):

```typescript
const enhancers = [];

// Add Whatever other enhancers you want.

if (__DEVMODE__ && window.devToolsExtension) {
  enhancers = [ ...enhancers, window.devToolsExtension() ];
}

// Add the dev tools enhancer your ngRedux.configureStore called
// when you initialize your root component:
@Component({
  // ...
})
class App {
  constructor(private ngRedux: NgRedux) {
    this.ngRedux.configureStore(rootReducer, initialState, [], enhancers);
  }
}
```

## API

### `configureStore()`

Initializes your ngRedux store. This should be called once, typically in your
top-level app component's constructor.

__Arguments:__

* `rootReducer` \(*Reducer*): Your top-level Redux reducer.
* `initialState` \(*Object): The desired initial state of your store.
* `middleware` \(*Middleware[]*): An optional array of Redux middleware functions.
* `enhancers` \(*StoreEnhancer[StoreEnhancer]*): An optional array of Redux store enhancer functions.

### select(key | function,[comparer]) => Observable

Exposes a slice of state as an observable. Accepts either a property name or a selector function.

If using the async pipe, you do not need to subscribe to it explicitly, but can use the angular
Async pipe to bind its values into your template.

__Arguments:__

* `key` \(*string*): A key within the state that you want to subscribe to. 
* `selector` \(*Function*): A function that accepts the application state, and returns the slice you want subscribe to for changes. 

e.g:
```typescript
this.counter$ = this.ngRedux.select(state=>state.counter);
// or 
this.counterSubscription = this.ngRedux
  .select(state=>state.counter)
  .subscribe(count=>this.counter = count);
// or

this.counter$ = this.ngRedux.select('counter');  
```

### `connect(mapStateToTarget, mapDispatchToTarget)(target)`

Connects an Angular component to Redux, and maps action creators and store
properties onto the component instance.

__Arguments:__
* `mapStateToTarget` \(*Function*): connect will subscribe to Redux store updates. Any time it updates, mapStateToTarget will be called. Its result must be a plain object, and it will be merged into `target`. If you have a component which simply triggers actions without needing any state you can pass null to `mapStateToTarget`.
* [`mapDispatchToTarget`] \(*Object* or *Function*): Optional. If an object is passed, each function inside it will be assumed to be a Redux action creator. An object with the same function names, but bound to a Redux store, will be merged onto `target`. If a function is passed, it will be given `dispatch`. It’s up to you to return an object that somehow uses `dispatch` to bind action creators in your own way. (Tip: you may use the [`bindActionCreators()`](http://gaearon.github.io/redux/docs/api/bindActionCreators.html) helper from Redux.).

*You then need to invoke the function a second time, with `target` as parameter:*
* `target` \(*Object* or *Function*): If passed an object, the results of `mapStateToTarget` and `mapDispatchToTarget` will be merged onto it. If passed a function, the function will receive the results of `mapStateToTarget` and `mapDispatchToTarget` as parameters.

e.g:
```typescript
connect(this.mapStateToThis, this.mapDispatchToThis)(this);
//Or
connect(this.mapState, this.mapDispatch)((selectedState, actions) => {/* ... */});
```

__Remarks:__
* The `mapStateToTarget` function takes a single argument of the entire Redux store’s state and returns an object to be passed as props. It is often called a selector. Use reselect to efficiently compose selectors and compute derived data.

### Store API
All of redux's store methods (i.e. `dispatch`, `subscribe` and `getState`) are exposed by $ngRedux and can be accessed directly. For example:

```typescript
ngRedux.subscribe(() => {
    let state = $ngRedux.getState();
    //...
})
```

This means that you are free to use Redux basic API in advanced cases where `connect`'s API would not fill your needs.
