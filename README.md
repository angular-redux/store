# ng2-redux
###### Angular 2 bindings for Redux.

For Angular 1 see [ng-redux](https://github.com/wbuchwalter/ng-redux)

[![Circle CI](https://circleci.com/gh/angular-redux/ng2-redux/tree/master.svg?style=svg)](https://circleci.com/gh/angular-redux/ng2-redux/tree/master)
[![npm version](https://img.shields.io/npm/v/ng2-redux.svg?style=flat-square)](https://www.npmjs.com/package/ng2-redux)

ngRedux lets you easily connect your angular components with Redux.


## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API](#api)
- [Using DevTools](#using-devtools)

## Installation

```js
npm install --save ng2-redux
```

## Quick Start

### Initialization

```JS
import {bootstrap} from 'angular2/platform/browser';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {App} from './containers/App';
import {provider} from  'ng2-redux';
import {rootReducer} from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

bootstrap(
  App,
  [provider(store)]
  );
```

#### Usage

`ng2-redux` has two ways that it can be used. The first way is using the `ngRedux.connect` API, which will map the state and dispatch actions to the provided target. 

There is also `ngRedux.select`, which will expose a slice of your state as an RxJs observable. 


#### ngRedux.select 
```JS
import * as CounterActions from '../actions/CounterActions';
import {NgRedux} from 'ng2-redux';
import {Observable} from 'rxjs';

class CounterApp {
  count$: Observable<number>;
  counterSubscription: Function;
  
  constructor(private ngRedux: NgRedux) { }

  ngOnInit() {
    this.count$ = this.ngRedux
    .select(n=>n.counter)   
    this.ngRedux.mapDispatchToTarget(CounterActions)
   
  }

}
```

#### ngRedux.connect

```JS
import * as CounterActions from '../actions/CounterActions';
import {NgRedux} from 'ng2-redux';

class CounterApp {
  constructor(ngRedux: NgRedux) {
    this.unsubscribe = ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscribe();
  }

  mapStateToThis(state) {
    return {
      counter: state.counter
    };
  }

  mapDispatchToThis(dispatch) {
    return { actions: bindActionCreators(CounterActions, dispatch) };
  }
}
```


## API

### `provider(store)`

Provide the Redux store to `connect`.

#### Arguments:
* `store` \(*Object*): Redux's store instance

### `connect(mapStateToTarget, [mapDispatchToTarget])(target)`

Connects an Angular component to Redux.

#### Arguments
* `mapStateToTarget` \(*Function*): connect will subscribe to Redux store updates. Any time it updates, mapStateToTarget will be called. Its result must be a plain object, and it will be merged into `target`. If you have a component which simply triggers actions without needing any state you can pass null to `mapStateToTarget`.
* [`mapDispatchToTarget`] \(*Object* or *Function*): Optional. If an object is passed, each function inside it will be assumed to be a Redux action creator. An object with the same function names, but bound to a Redux store, will be merged onto `target`. If a function is passed, it will be given `dispatch`. It’s up to you to return an object that somehow uses `dispatch` to bind action creators in your own way. (Tip: you may use the [`bindActionCreators()`](http://gaearon.github.io/redux/docs/api/bindActionCreators.html) helper from Redux.).

*You then need to invoke the function a second time, with `target` as parameter:*
* `target` \(*Object* or *Function*): If passed an object, the results of `mapStateToTarget` and `mapDispatchToTarget` will be merged onto it. If passed a function, the function will receive the results of `mapStateToTarget` and `mapDispatchToTarget` as parameters.

e.g:
```JS
connect(this.mapStateToThis, this.mapDispatchToThis)(this);
//Or
connect(this.mapState, this.mapDispatch)((selectedState, actions) => {/* ... */});
```

#### Remarks
* The `mapStateToTarget` function takes a single argument of the entire Redux store’s state and returns an object to be passed as props. It is often called a selector. Use reselect to efficiently compose selectors and compute derived data.


### select(key | function,[comparer]) => Observable

Exposes a slice of state as an observable. Accepts either a key-path, or a selector function.

If using the async pipe, you do not need to subscribe to it explicitly, but can use the angular Async pipe to observe for values.

#### Arguments

* `key` \(*string*): A key within the state that you want to subscribe to. 
* `selector` \(*Function*): A function that accepts the application state, and returns the slice you want subscribe to for changes. 


e.g:
```JS
this.counter$ = this.ngRedux.select(state=>state.counter);
// or 
this.counterSubscription = this.ngRedux
  .select(state=>state.counter)
  .subscribe(count=>this.counter = count);
// or

this.counter$ = this.ngRedux.select('counter');  
```


### Store API
All of redux's store methods (i.e. `dispatch`, `subscribe` and `getState`) are exposed by $ngRedux and can be accessed directly. For example:

```JS
ngRedux.subscribe(() => {
    let state = $ngRedux.getState();
    //...
})
```

This means that you are free to use Redux basic API in advanced cases where `connect`'s API would not fill your needs.

## Using DevTools

Ng2Redux is fully compatible with the Chrome extension version of the Redux dev tools:

https://github.com/zalmoxisus/redux-devtools-extension

Here's how to enable them in your app (you probably only want to do
this in development mode):

1. Add the extension to your storeEnhancers:

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

2. Make Angular 2 update when store events come from the dev tools
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
