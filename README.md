# ng2-redux

Angular 2 bindings for [Redux](https://github.com/reactjs/redux).

For Angular 1 see [ng-redux](https://github.com/wbuchwalter/ng-redux)

[![Join the chat at https://gitter.im/angular-redux/ng2-redux](https://badges.gitter.im/angular-redux/ng2-redux.svg)](https://gitter.im/angular-redux/ng2-redux?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![CircleCI](https://img.shields.io/circleci/project/angular-redux/ng2-redux/master.svg?maxAge=2592000)](https://circleci.com/gh/angular-redux/ng2-redux/tree/master)
[![npm version](https://img.shields.io/npm/v/ng2-redux.svg)](https://www.npmjs.com/package/ng2-redux)
[![npm downloads](https://img.shields.io/npm/dt/ng2-redux.svg)](https://www.npmjs.com/package/ng2-redux)

Ng2Redux lets you easily connect your Angular 2 components with Redux, while still respecting the Angular 2 idiom.

Features include:
* The ability to access slices of store state as `Observables`
* Compatibility with existing Redux middleware and enhancers
* Compatibility with the existing Redux devtools Chrome extension
* A rich, declarative selection syntax using the `@select` decorator

In addition, we are committed to providing insight on clean strategies for integrating with Angular 2's change detection and other framework features.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Examples](#examples)
- [Resources](#resources)
- [In Depth Usage](#in-depth-usage)
- [API](docs/api.md)

## Installation

Ng2Redux has a peer dependency on redux, so we need to install it as well.

```sh
npm install --save redux ng2-redux
```

## Quick Start

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './containers/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
```
Import the `NgReduxModule` class and add it to your application module as an
`import`. Once you've done this, you'll be able to inject `NgRedux` into your
Angular 2 components. In your top-level app module, you
can configure your Redux store with reducers, initial state,
and optionally middlewares and enhancers as you would in Redux directly.

```typescript
import { NgReduxModule, NgRedux } from 'ng2-redux';
import reduxLogger from 'redux-logger';
import { rootReducer } from './reducers';

interface IAppState { /* ... */ };

@NgModule({
  /* ... */
  imports: [ /* ... */, NgReduxModule ]
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, {}, [ createLogger() ]);
  }
}
```

Or if you prefer to create the Redux store yourself you can do that and use the
`provideStore()` function instead:

```typescript
import {
  applyMiddleware,
  Store,
  combineReducers,
  compose,
  createStore
} from 'redux';
import { NgReduxModule, NgRedux } from 'ng2-redux';
import reduxLogger from 'redux-logger';
import { rootReducer } from './reducers';

interface IAppState { /* ... */ };

export const store: Store<IAppState> = createStore(
  rootReducer,
  compose(applyMiddleware(reduxLogger)));

@NgModule({
  /* ... */
  imports: [ /* ... */, NgReduxModule ]
})
class AppModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.provideStore(store);
  }
}
```

Now your Angular 2 app has been reduxified! Use the `@select` decorator to
access your store state, and `.dispatch()` to dispatch actions:

```typescript
import { select } from 'ng2-redux';

@Component({
  template: '<button (click)="onClick()">Clicked {{ count | async }} times</button>'
})
class App {
  @select() count$: Observable<number>;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  onClick() {
    this.ngRedux.dispatch({ type: INCREMENT });
  }
}
```

## Examples

Here are some examples of Ng2Redux in action:

* [Counter: basic select pattern example](examples/counter)
* [Trendy Brunch: multi-reducer example with redux-localstorage](https://github.com/e-schultz/ng2-camp-example)
* [Plnkr: smart & presentational components example](https://plnkr.co/edit/XCGzzxoinM8cRAKp2huU?p=preview)
* [Angular2-redux-starter from Rangle.io (with Epic, devtools)](https://github.com/rangle/angular2-redux-starter)
* [Simple SystemJS Example (Angular Quickstart)](https://github.com/angular-redux/system-js-example)

## Companion Packages

* [Reduxify your Routing with Ng2-Redux-Router](https://github.com/dagstuan/ng2-redux-router)
* [Reduxify your Forms with Ng2-Redux-Form](https://github.com/clbond/ng2-redux-form)

## Resources

* [Using Redux with Angular 2 - JS Toronto Meetup 2016-07-12](https://www.youtube.com/watch?v=s4xr2avwv3s)
* [Angular 2 and Redux from Rangle.io](http://ngcourse.rangle.io/handout/redux/)
* [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux)
* [Awesome Redux: Community Resources](https://github.com/xgrommx/awesome-redux)

## In-Depth Usage

Ng2Redux uses an approach to redux based on RxJS Observables to `select` and transform
data on its way out of the store and into your UI or side-effect handlers. Observables
are an efficient analogue to `reselect` for the RxJS-heavy Angular world. 

Read more here: [Select Pattern](docs/select-pattern.md)

We also have a number of 'cookbooks' for specific Angular 2 topics:

* [Using Angular 2's Dependency Injector with Action Creators](docs/action-creator-service.md)
* [Using Angular 2's Dependency Injector with Middlewares](docs/di-middleware.md)
* [Managing Side-Effects with redux-observable Epics](docs/epics.md)
* [Using the Redux DevTools Chrome Extension](docs/redux-dev-tools.md)
* [Ng2Redux and ImmutableJS](docs/immutable-js.md)
* [Strongly Typed Reducers](docs/strongly-typed-reducers.md)
