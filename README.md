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

Configure your store as you would with any redux application.  Then use
ng2-redux's `provider` function to inject your store into the Angular 2
dependency injector:

```typescript
import { bootstrap } from 'angular2/platform/browser';
import { createStore, applyMiddleware } from 'redux';
import { provider } from  'ng2-redux';
const thunk = require('redux-thunk').default;

import { App } from './containers/App';
import { rootReducer } from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

bootstrap(App, [provider(store)]);
```

Once you've done this, you'll be able to inject 'NgRedux' into your
Angular 2 components:

```typescript
import { NgRedux } from 'ng2-redux';

interface IAppState {
  // ...   
};
@Component({
  // ... etc.
})
class AppComponent {
  constructor(private ngRedux: NgRedux<IAppState>) {}

  // ...
}
```

## Usage

`ng2-redux` has two main usage patterns: the `select` pattern and the `connect` pattern.

### The Select Pattern

This is the preferred approach for Angular 2, since it uses Observables to interface
more cleanly with common Angular 2 usage patterns.

In this approach, we use `ngRedux.select()` to get observables from slices of our store
state:

```typescript
import { Component} from 'angular2/core';
import { Observable} from 'rxjs';
import { AsyncPipe} from 'angular2/common';
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
export class App {
  counter$: any;

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
import { Component } from 'angular2/core';
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
export class App {
  private disconnect: (a?:any) => void;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  ngOnInit() {
    this.disconnect = this.ngRedux.connect(
      this.mapStateToTarget,
      this.mapDispatchToTarget)(this);
  }

  mapDispatchToTarget(dispatch) {
    return {
      actions: bindActionCreators(CounterActions, dispatch)
    };
  }

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
import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';

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
      dispatch(LOGIN_USER_PENDING);

      this.http.post('/auth/login', credentials)
        .toPromise()
        .then(response => dispatch(LOGIN_USER_SUCCESS, response.json())
        .catch(error => dispatch(LOGIN_USER_ERROR, error);
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
import { Component } from 'angular2/core';
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

    ngRedux.mapDispatchToTarget((dispatch) => {
      return {
        login: (credentials) => dispatch(
          this.sessionActions.loginUser(credentials)),
        logout: () => dispatch(
          this.sessionActions.logoutUser())
      };
    })(this);
  }
};
```

### Using Angular 2 Services in your Middleware

This is a bit more complicated, due to the fact that the redux store is configured
before the app's dependency injector is bootstrapped. We're investigating alternatives
for an upcoming release.

However in the short term, you can inject into your middlewares manually as shown
below.

In the main application component, we save a reference to the app's root injector,
which is available post-bootstrap:

`app.ts`:

```typescript
import { provider } from 'ng2-redux';
import { HTTP_PROVIDERS } from 'angular2/http';
import { setAppInjector } from './utils/app-injector';

bootstrap(RioSampleApp, [
  provider(store),
  HTTP_PROVIDERS,
  //...
]).then((appRef: ComponentRef) => {
  setAppInjector(appRef.injector);
});
```

Note `utils/app-injector`, which provides a place to save it:

```typescript
import { Injector } from 'angular2/core';

let appInjector: Injector;

export function setAppInjector(injector: Injector): void {
  appInjector = injector;
}

export function getAppInjector(): Injector {
  return appInjector;
}
```

Then when we write a middleware, we can access the root injector
manually to get access to Angular services like HTTP:

`log-name-middleware.ts`:

```typescript
import { Http } from 'angular2/http';
import { getAppInjector } from '../utils/app-injector';

export const logNameMiddleware = store => next => action => {
  const http = getAppInjector().get(Http);
  
  console.log('getting user name');
  http.get('http://jsonplaceholder.typicode.com/users/1')
    .toPromise()
    .then(response => {
      console.log('got name:', response.json().name);
      return next(action);
    })
    .catch(err => console.log('get name failed:', err));
};
```

### Using DevTools

Ng2Redux is fully compatible with the Chrome extension version of the Redux dev tools:

https://github.com/zalmoxisus/redux-devtools-extension

Here's how to enable them in your app (you probably only want to do
this in development mode):

__Step 1:__ Add the extension to your storeEnhancers:

```typescript
const enhancers = [];

// Add Whatever other enhancers you want.

if (__DEVMODE__ && window.devToolsExtension) {
  enhancers = [ ...enhancers, window.devToolsExtension() ];
}

const store = compose(
    applyMiddleware(middleware),
    ...enhancers
  )(createStore)(rootReducer, initialState);
```

__Step 2:__ Make Angular 2 update when store events come from the dev tools
instead of Ng2Redux:

```typescript
@Component({
  // etc.
})
export class App {
  private unsubscribe: () => void;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    applicationRef: ApplicationRef) {

    // etc.

    if (__DEVMODE__) {
      this.unsubscribe = ngRedux.subscribe(() => {
        applicationRef.tick();
      });
    }
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
```

## API

### `provider()`

Binds an NgRedux instance to your Redux store and makes it available to Angular's
dependency injector as an injectable service.

__Arguments:__

* `store` \(*Object*): Redux's store instance

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
