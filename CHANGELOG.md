# 4.1.0

### Fixes:

* #228 ('generic' error with AoT)
* #251 (No provider for DevToolsExtension)

# 4.0.0

### Features 

* Better support for Angular CLI
* NgModule interface changes to better support Angular 2's ahead-of-time compiler (AoT)

### Fixes

* Update build to use ngc - metadata.json is now produced
* Introduced NgReduxModule
* Fix AoT related bugs #247, #235, #228

### Breaking Change: Using NgReduxModule 

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgReduxModule, NgRedux } from 'ng2-redux';
import { IAppState } from './appstate';
import { rootReducer } from './store';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgReduxModule.forRoot(),
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(ngRedux: NgRedux<IAppState>) {
   
    ngRedux.configureStore(rootReducer,{});
  }
}

```

### Dev Tools 

The DevTools provider is not provider by default with the `NgReduxModule`, as you may not want to include this for production builds. To use `DevToolsExtension`, it is the same as before - and still need to include it in your providers.

```js
import { NgReduxModule, DevToolsExtension }

@NgModule({
  providerS: [DevToolsExtension]
})
export class AppModule {
  constructor(ngRedux:NgRedux<IAppState>, devTools:DevToolsExtension) {
    // config as before 
  }
}
```

**IMPORTANT NOTE ABOUT AOT AND ANGULAR-CLI**

If using the angular-cli with the --aot option - `@select` decorators will not work. The build process will work, but decorators will silently stop working. This is due to angular/angular-cli/2799, which is on their roadmap already.

If you need decorators and AoT, you'll need to use the raw ngc compiler directly from the command line.

**before**

```js 
import { select } from 'ng2-redux';
export class MyComponent {
  @select() thing$:Observable<string>; 
}
```

**after**

```js
import { NgRedux } from 'ng2-redux';
export class MyComponent {
  thing$: Observable<string>;
  constructor(private ngRedux:NgRedux<MyAppState>) {

  }
  ngOnInit() {
    this.thing$ = this.ngRedux.select (n => n.thing);
  }
}
```

# 3.3.9

### Fixes

* Temp update to npm build to uninstall typings for chai/sinon-chai so `///  <reference types="chai" />` doesn't get added to files.

# 3.3.8

### Fixes 

* Manual fix of build to remove chai type reference 

# 3.3.7

### Features

* Improved error if trying to dispatch before store is configured - #118, #198

### Fixes

* Relax Zone JS version - #189, #187
* Fix DevTools being out of sync for actions dispatched from tool, #192

### Chores/Misc

* Upgrade to TypeScript 2 - #189, #190
* Add Code Coverage - #193, #206, #207



# 3.3.5

### Fixes

* Update redux peer dependency to 3.5.0 
  * observable shim which we depend on was introduced in 3.5.0, not 3.4.0 

# 3.3.4

### Chore 

* Update to RC5 (#184, fixes #183)
* Include src in npm package (#182, fixes #180)

### Fixes 

* Fix window in Universal (#185, fixes #172)
 

# 3.3.3

### Fixes 

* Fix window is undefined in Universal (#178, fixes #172)

# 3.3.2 

### Fixes 

* Change seamless immutable integration to not need conditional require (#169)

# 3.3.1

### Fixes 

* Argument to DevTools enhancer is now optional (#164)
* Decorator deletes key on target, not `this`. (#168, fixes #166) 

# 3.3.0 

### Features 

* [DevToolsExtension - convience wrapper for dev tools](docs/redux-dev-tools.md) (#115)
* [Select - seamless support for ImmutableJS](docs/immutable-js.md) (#160)


### Fixes 

* Able to use `@select` in services 
* Behavior of `select` with chained dispatches, (fixes #149, #153)


# 3.2.0

### Features

* Added a `provideStore()` function which lets you pass in a already created
store. It can be used as this:

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

# 3.1.0

### Features

* Added a 'path' option to `ngRedux.select()` and `@select()`. Now you can
do stuff like `@select(['foo', 'bar'])` to select `state.foo.bar` into
an observable.

* Add ability to provide custom comparer to @select decorator to keep consistent with ngRedux.select

```js
import { is } from 'immutablejs'

export class SomeComponent {
  @select(n=n.some.selector, is) someSelector$: Observable<any>
}

```
### Features

# 3.0.8

### Fix

* AppliicationRef is optional dependency, fixes#127

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
