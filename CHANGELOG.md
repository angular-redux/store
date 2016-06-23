# 3.0.6

### Features

Added a 'path' option to `ngRedux.select()` and `@select()`. Now you can
do stuff like `@select(['foo', 'bar'])` to select `state.foo.bar` into
an observable.

# 3.0.0

### Features

#### Select Decorator
This release introduces the new decorator interface. You can now use 
`@select`  to create an observable from a slice of store state.

See 'the select pattern' in [README.md](README.md#the-select-pattern)
for a complete description of how to use this new decorator.

#### Simpler Redux DevTools Integration

You no longer need to manually subscribe and `ApplicationRef.tick()`
for Redux DevTools to work; we do this automatically for you.

### Breaking Changes

#### Bootstrapping

We've changed how bootstrapping Ng2-Redux works. The `provider`
function has gone away in favour of making NgRedux a first-class
`@Injectable`.

You now configure your store in the constructor of your top-level
app component instead of prior to bootstrapping. This allows the
store to be configured with middleware and enhancers that rely on
Angular 2 services, which previously was unnecessarily difficult.

##### Old way:

**bootstrap.ts:**
```typescript
import { bootstrap } from '@angular/platform-browser-dynamic';
import { createStore, applyMiddleware, compose } from 'redux';
import { NgRedux } from 'ng2-redux';
const createLogger = require('redux-logger');
const persistState = require('redux-localstorage');
import { rootReducer } from './reducers';
import { App } from './app';

// Confusing and hard to use with dependency injection.
const middleware = [ createLogger() ];
const enhancers = [ persistState('counter', { key: 'example-app' }) ];
const store = compose(
  applyMiddleware(middleware),
  ...enhancers)
    (createStore)(rootReducer);

bootstrap(App, [ provide(store) ])
```

**app.ts**
```typescript
import { Component } from '@angular/core';
import { NgRedux } from 'ng2-redux';

@Component({
  // ...
})
export class App {
  constructor(private ngRedux: NgRedux) {}
}
```

##### New way:

**bootstrap.ts:**
```typescript
import { bootstrap } from '@angular/platform-browser-dynamic';
import { NgRedux } from 'ng2-redux';
import { App } from './app';

bootstrap(App, [ Ng2Redux ]);
```

**app.ts**
```typescript
import { Component } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { reduxLogger } from 'redux-logger';
import { initialState, rootReducer } from './reducers';

@Component({
  // ...
})
export class App {
  constructor(private ngRedux: NgRedux) {
    const middleware = [ reduxLogger ];
    const enhancers = [ persistState('counter', { key: 'example-app' }) ];

    // Easier to understand, and can use middleware or enhancers from DI.
    ngRedux.configureStore(rootReducer, initialState, middleware, enhancers);
  }
}
```

#### Example App Updates

The example app has been updated to use `@select` and a
DI-aware action creator service (`counter-actions.ts`). It now also
shows examples of using middleware and enhancers from the Redux
community: `redux-logger` and `redux-localstorage`.

# 2.2.2

### Features

* **Type definitions**: 
  * Ported to typescript
  * Supports typed stores / reducers 
  * Uses offical Redux type definitions
* **Type Injectable**:
  * Able to inject `NgRedux` into your component by type, and not need `@Inject('ngRedux')`
  * `@Inject('ngRedux')` still works

```typescript
import { NgRedux } from 'ng2-redux';
// ... 
export class MyComponent {
  constructor(private ngRedux: NgRedux) {}
}
```
* **State as Observable**: Ability to expose parts of your state as an observable.

```typescript
select<S>(selector: string | number | symbol | ((state: RootState) => S), comparer?: (x: any, y: any) => boolean): Observable<S>;
    wrapActionCreators: (actions: any) => (dispatch: Redux.Dispatch<any>) => Redux.ActionCreator<{}> | Redux.ActionCreatorsMapObject;
```

Example use:

```typescript
import { NgRedux } from 'ng2-redux';
// ...
export class MyComponent implements OnInit {
  countByKey$: Observable<number>;
  countByFunc$: Observable<number>;

  constructor(private ngRedux: NgRedux) {
    this.countByKey$ = this.ngRedux.select('count');
    this.countByFunc$ = this.ngRedux.select(state=>state.count);
  }
}
```

Also have the ability to provide a custom compare function.

```typescript
import { is, Map } from 'immutable';
import { NgRedux } from 'ng2-redux';

// ...
export class MyComponent implements OnInit {
  person$: Observable<Map<string,any>>;

  constructor(private ngRedux: ngRedux) {
    // even if the reference of the object has changed, 
    // if the data is the same - it wont be treated as a change
    this.person$ = this.ngRedux.select(state=>state.people.get(0),is);
  }
}
```
