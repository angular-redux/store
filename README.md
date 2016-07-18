# ng2-redux

Angular 2 bindings for [Redux](https://github.com/reactjs/redux).

For Angular 1 see [ng-redux](https://github.com/wbuchwalter/ng-redux)

[![Join the chat at https://gitter.im/angular-redux/ng2-redux](https://badges.gitter.im/angular-redux/ng2-redux.svg)](https://gitter.im/angular-redux/ng2-redux?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![CircleCI](https://img.shields.io/circleci/project/angular-redux/ng2-redux/master.svg?maxAge=2592000)](https://circleci.com/gh/angular-redux/ng2-redux/tree/master)
[![npm version](https://img.shields.io/npm/v/ng2-redux.svg)](https://www.npmjs.com/package/ng2-redux)
[![npm downloads](https://img.shields.io/npm/dt/ng2-redux.svg)](https://www.npmjs.com/package/ng2-redux)

ng2-redux lets you easily connect your Angular 2 components with Redux.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [The select pattern](#the-select-pattern)
  - [The connect pattern](#the-connect-pattern)
- [A Note about Internet Explorer](#a-note-about-internet-explorer)
- [Examples](#examples)
- [Cookbooks](#cookbooks)
  - [Using Angular 2 Services in your Action Creators](#using-angular-2-services-in-your-action-creators)
  - [Using Angular 2 Services in your Middleware](#using-angular-2-services-in-your-middleware)
  - [Side-Effect Management Using Epics](#side-effect-management-using-epics)
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
import { bootstrap } from '@angular/platform-browser-dynamic';
import { App } from './containers/App';

bootstrap(App, [ NgRedux ]);
```

Once you've done this, you'll be able to inject 'NgRedux' into your
Angular 2 components. In your top-level app component, you
can configure your Redux store with reducers, initial state,
and optionally middlewares and enhancers as you would in Redux directly.

```typescript
import { NgRedux } from 'ng2-redux';
import reduxLogger from 'redux-logger';
import { rootReducer } from './reducers';

interface IAppState {
  // ...
};
@Component({
  // ... etc.
})
class App {
  constructor(private ngRedux: NgRedux) {
    this.ngRedux.configureStore(rootReducer, {}, [ reduxLogger() ]);
  }

  // ...
}
```

Or if you prefer to create the Redux store yourself you can do that and use the
`provideStore()` function instead.

Create your store:
```typescript
// store.ts

import {
  applyMiddleware,
  Store,
  combineReducers,
  compose,
  createStore
} from 'redux';
import thunk from 'redux-thunk';
import reduxLogger from 'redux-logger';

import { myReducer } from './reducers/my-reducer';

const rootReducer = combineReducers({
  myReducer,
});

export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(
      thunk,
      reduxLogger
    )
  )
) as Store
```

Create your App and call `provideStore` with your newly created store:
```typescript
// app.ts

import { NgRedux } from 'ng2-redux';
import { store } from './store.ts';

interface IAppState {
  // ...
};
@Component({
  // ... etc.
})
class App {
  constructor(private ngRedux: NgRedux) {
    this.ngRedux.provideStore(store);
  }

  // ...
}
```

Now your Angular 2 app has been reduxified!

## Usage

`ng2-redux` has two main usage patterns: the `select` pattern and the `connect` pattern.

### The Select Pattern

The select pattern allows you to get slices of your state as RxJS observables.

These plug in very efficiently to Angular 2's change detection mechanism and this is the
preferred approach to accessing store data in Angular 2.

#### The @select decorator

The `@select` decorator can be added to the property of any class or angular
component/injectable. It will turn the property into an observable which observes
the Redux Store value which is selected by the decorator's parameter.

The decorator expects to receive a `string`, an array of `string`s, a `function` or no
parameter at all.

- If a `string` is passed the `@select` decorator will attempt to observe a store
property whose name matches the `string`.
- If an array of strings is passed, the decorator will attempt to match that path
through the store (similar to `immutableJS`'s `getIn`).
- If a `function` is passed the `@select` decorator will attempt to use that function
as a selector on the RxJs observable.
- If nothing is passed then the `@select` decorator will attempt to use the name of the class property to find a matching value in the Redux store. Note that a utility is in place here where any $ characters will be ignored from the class property's name.

```typescript
import { Component } from '@angular2/core';
import { AsyncPipe } from '@angular2/common';
import { Observable } from 'rxjs/Observable';
import { select } from 'ng2-redux';

@Component({
    pipes: [AsyncPipe],
    selector: 'counter-value-printed-many-times',
    template: `
    <p>{counter$ | async}</p>
    <p>{counter | async}</p>
    <p>{counterSelectedWithString | async}</p>
    <p>{counterSelectedWithFunction | async}</p>
    <p>{counterSelectedWithFunctionAndMultipliedByTwo | async}</p>
    `
})
export class CounterValue {

    // this selects `counter` from the store and attaches it to this property
    // it uses the property name to select, and ignores the $ from it
    @select() counter$;

    // this selects `counter` from the store and attaches it to this property
    @select() counter;

    // this selects `counter` from the store and attaches it to this property
    @select('counter') counterSelectedWithString;

    // this selects `pathDemo.foo.bar` from the store and attaches it to this
    // property.
    @select(['pathDemo', 'foo', 'bar']) pathSelection;

    // this selects `counter` from the store and attaches it to this property
    @select(state => state.counter) counterSelectedWithFunction;

    // this selects `counter` from the store and multiples it by two
    @select(state => state.counter * 2)
    counterSelectedWithFuntionAndMultipliedByTwo: Observable<any>;
}
```

### Select Without Decorators

If you like RxJS, but aren't comfortable with decorators, you can also make
store selections using the `ngRedux.select()` function.

```typescript
import { Component } from '@angular2/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular2/common';
import { Counter } from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import { NgRedux } from 'ng2-redux';

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
  private counter: number;

  constructor(private ngRedux: NgRedux<IAppState>) {
    ngRedux.connect(this.mapStateToTarget, this.mapDispatchToThis)(this);
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

## A Note about Internet Explorer

This library relies on the presence of `Object.assign` and `Array.forEach`.
Internet Explorer requires polyfills for these; however these same functions
are also needed for Angular 2 itself to work.  Just make sure you include
[core-js](https://npmjs.com/package/core-js) or [es6-shim](https://npmjs.com/packages/es6-shim)
if you need to support IE.

## Examples

Here are some examples of Ng2Redux in action:

* [Counter: basic select pattern example](examples/counter)
* [Trendy Brunch: multi-reducer example with redux-localstorage](https://github.com/e-schultz/ng2-camp-example)
* [Plnkr: smart & presentational components example](https://plnkr.co/edit/m910XrXyFrUty2nXUJ1q?p=preview)

## Cookbooks

### Using Angular 2 Services in your Action Creators

In order to use services in action creators, we need to integrate
them into Angular 2's dependency injector.

We may as well adopt a more class-based approach to satisfy
Angular 2's OOP idiom, and to allow us to

1. make our actions `@Injectable()`, and
2. inject other services for our action creators to use.

Take a look at this example, which injects NgRedux to access
`dispatch` and `getState` (a replacement for `redux-thunk`),
and a simple `RandomNumberService` to show a side effect.

```typescript
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import * as Redux from 'redux';
import { RootState } from '../store';
import { RandomNumberService } from '../services/random-number';

@Injectable()
export class CounterActions {
  constructor (
    private ngRedux: NgRedux<RootState>,
    private randomNumberService: RandomNumberService) {}

  static INCREMENT_COUNTER: string = 'INCREMENT_COUNTER';
  static DECREMENT_COUNTER: string = 'DECREMENT_COUNTER';
  static RANDOMIZE_COUNTER: string = 'RANDOMIZE_COUNTER';

  // Basic action
  increment(): void {
    this.ngRedux.dispatch({ type: CounterActions.INCREMENT_COUNTER });
  }

  // Basic action
  decrement(): void {
    this.ngRedux.dispatch({ type: CounterActions.DECREMENT_COUNTER });
  }

  // Async action.
  incrementAsync(delay: number = 1000): void {
    setTimeout(this.increment.bind(this), delay);
  }

  // State-dependent action
  incrementIfOdd(): void {
    const { counter } = this.ngRedux.getState();
    if (counter % 2 !== 0) {
      this.increment();
    }
  }

  // Service-dependent action
  randomize(): void {
    this.ngRedux.dispatch({
      type: CounterActions.RANDOMIZE_COUNTER,
      payload: this.randomNumberService.pick()
    });
  }
}
```

To use these action creators, we can just go ahead and inject
them into our component:

```typescript
import { Component } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { CounterActions } from '../actions/counter-actions';
import { RandomNumberService } from '../services/random-number';

@Component({
  selector: 'counter',
  providers: [ CounterActions, RandomNumberService ],
  template: `
  <p>
    Clicked: {{ counter$ | async }} times
    <button (click)="actions.increment()">+</button>
    <button (click)="actions.decrement()">-</button>
    <button (click)="actions.incrementIfOdd()">Increment if odd</button>
    <button (click)="actions.incrementAsync(2222)">Increment async</button>
    <button (click)="actions.randomize()">Set to random number</button>
  </p>
  `
})
export class Counter {
  @select('counter') counter$: any;

  constructor(private actions: CounterActions) {}
}
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
      .map(response => {
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
import reduxLogger from 'redux-logger';

@Component({
  providers: [ LogRemoteName ],
  // ...
})
class App {
  constructor(
    private ngRedux: NgRedux
    logRemoteName: LogRemoteName) {

    const middleware = [ reduxLogger(), logRemoteName.middleware ];
    this.ngRedux.configureStore(
      rootReducer,
      initialState,
      middleware);
  }
}
```

### Side-Effect Management Using Epics

Ng2-Redux also works well with the `Epic` feature of
[redux-observable](https://github.com/redux-observable). For
example, a common use case for a side-effect is making an API call; while
we can use asynchronous actions for this, epics provide a much cleaner
approach.

Consider the following example of a user login implementation. First, we
create some trivial actions:

**session.actions.ts:**

```typescript
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../reducers';

@Injectable()
export class SessionActions {
  static LOGIN_USER = 'LOGIN_USER';
  static LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
  static LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';
  static LOGOUT_USER = 'LOGOUT_USER';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  loginUser(credentials) {
    this.ngRedux.dispatch({
      type: SessionActions.LOGIN_USER,
      payload: credentials,
    });
  };

  logoutUser() {
    this.ngRedux.dispatch({ type: SessionActions.LOGOUT_USER });
  };
} 
```

Next, we create an `@Injectable SessionEpic` service:

**session.epics.ts:**

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActionsObservable } from 'redux-observable';
import { SessionActions } from '../actions/session.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const BASE_URL = '/api';

@Injectable()
export class SessionEpics {
  constructor(private http: Http) {}

  login = (action$: ActionsObservable) => {
    return action$.ofType(SessionActions.LOGIN_USER)
      .flatMap(({payload}) => {
        return this.http.post(`${BASE_URL}/auth/login`, payload)
          .map(result => ({
            type: SessionActions.LOGIN_USER_SUCCESS,
            payload: result.json().meta
          }))
          .catch(error => Observable.of({
            type: SessionActions.LOGIN_USER_ERROR
          }));
        });
  }
}
```

This needs to be a service so that we can inject Angular's `HTTP` service.
However in this case we're using the same "arrow function bind trick" as we
did for the dependency-injected middleware cookbook above.

This allows us to configure our Redux store with the new epic as follows:

**app.component.ts:**

```typescript
import { Component } from '@angular/core';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './reducers';
import { SessionEpics } from './epics';

@Component({
  /* ... */
  providers: [ NgRedux, SessionEpics ]
})
export class App {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private epics: SessionEpics) {

      const middleware = [
        createEpicMiddleware(this.epics.login)
      ];
      ngRedux.configureStore(rootReducer, {}, middleware);
  }
};
```

Now, whenever you dispatch a "USER_LOGIN" action, the epic will trigger the
HTTP request, and fire a corresponding success or failure action. This allows
you to keep your action creators very simple, and to cleanly describe your
side effects as a set of simple RxJS epics.

### Using DevTools

Ng2Redux is fully compatible with the Chrome extension version of the Redux dev tools:

https://github.com/zalmoxisus/redux-devtools-extension

However, due to peculiarities of Angular 2's change detection logic,
events that come from external tools don't trigger a refresh in Angular's
zone.

We've taken the liberty of providing a wrapper around the extension
tools that handles this for you.

Here's how to hook the extension up to your app:

```typescript
import { DevToolsExtension } from 'ng2-redux';

// Add the dev tools enhancer your ngRedux.configureStore called
// when you initialize your root component:
@Component({
  // ...
  providers: [ DevToolsExtension ]
})
class App {
  constructor(
    private ngRedux: NgRedux,
    private devTools: DevToolsExtension) {

    let enhancers = [];
    // ... add whatever other enhancers you want.

    // You probably only want to expose this tool in devMode.
    if (__DEVMODE__ && devTools.isEnabled()) {
      enhancers = [ ...enhancers, devTools.enhancer() ];
    }

    this.ngRedux.configureStore(
      rootReducer,
      initialState,
      [],
      enhancers);
  }
}
```

`ReduxDevTools.enhancer()` takes the same options parameter as
documented here: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#windowdevtoolsextensionconfig

## API

### `configureStore()`

Adds your ngRedux store to NgRedux. This should be called once, typically in your
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

### `provideStore()`

Initializes your ngRedux store. This should be called once, typically in your
top-level app component's constructor. If `configureStore`
has been used this cannot be used.

__Arguments:__

* `store` \(*Store*): Your app's store.

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

### @select(key | path | function)

Property decorator.

Attaches an observable to the property which will reflect the latest value in the Redux store.

__Arguments:__

* `key` \(*string*): A key within the state that you want to subscribe to.
* `path` \(*string[]*): A path of nested keys within the state you want to subscribe to.
* `selector` \(*Function*): A function that accepts the application state, and returns the slice you want to subscribe to for changes.

e.g. see [the @select decorator](#the-select-decorator)

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
