# ng2-redux
###### Angular 2 bindings for Redux.

For Angular 1 see [ng-redux](https://github.com/wbuchwalter/ng-redux)

[![build status](https://img.shields.io/travis/wbuchwalter/ng2-redux/master.svg?style=flat-square)](https://travis-ci.org/wbuchwalter/ng2-redux)
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

#### Initialization

```JS
import {bootstrap} from 'angular2/angular2';
import {bind} from 'angular2/di';
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

```JS
import * as CounterActions from '../actions/CounterActions';

class CounterApp {
  constructor( @Inject('ngRedux') ngRedux) {
    this.unsubscribe = ngRedux.connect(this.mapStateToScope, this.mapDispatchToProps)(this);
  }

  onInit() {}

  onDestroy() {
    this.unsubscribe();
  }

  mapStateToScope(state) {
    return {
      counter: state.counter
    };
  }

  mapDispatchToProps(dispatch) {
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
connect(this.mapState, this.mapDispatch)(this);
//Or
connect(this.mapState, this.mapDispatch)((selectedState, actions) => {/* ... */});
```


#### Remarks
* The `mapStateToTarget` function takes a single argument of the entire Redux store’s state and returns an object to be passed as props. It is often called a selector. Use reselect to efficiently compose selectors and compute derived data.


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

In order to use Redux DevTools with your angular app, you need to install [react](https://www.npmjs.com/package/react), [react-redux](https://www.npmjs.com/package/react-redux) and [redux-devtools](https://www.npmjs.com/package/redux-devtools) as development dependencies.

You can find a sample devtools implentation in the [counter example](https://github.com/wbuchwalter/ng2-redux/blob/master/examples/counter/devTools.js)
