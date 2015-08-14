# ng2-redux
###### Angular 2 bindings for Redux.

For Angular 1 see [ng-redux](https://github.com/wbuchwalter/ng-redux)

##### This is a work very much in progress, use at your own risk :)

## Overview

ngRedux lets you easily connect your angular components with Redux.
the API is straightforward: 

```JS
ngRedux.connect(selector, callback, disableCaching = false);
//OR
ngRedux.connect([selector1, selector2, ...], callback, disableCaching = false);
```

Where selector is a function taking for single argument the entire redux Store's state (a plain JS object) and returns another object, which is the slice of the state that your component is interested in.
e.g:
```JS
state => state.todos
```
Note: if you are not familiar with this syntax, go and check out the [MDN Guide on fat arrow  functions (ES2015)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

If you haven't, check out [reselect](https://github.com/faassen/reselect), an awesome tool to create and combine selectors.


This returned object will be passed as argument to the callback provided whenever the state changes.
ngRedux checks for shallow equality of the state's selected slice whenever the Store is updated, and will call the callback only if there is a change.
##### Important: It is assumed that you never mutate your states, if you do mutate them, ng-redux will not execute the callback properly.
See [Redux's doc](http://gaearon.github.io/redux/docs/basics/Reducers.html) to understand why you should not mutate your states.
If you have a good reason to mutate your states, you can still [disable caching](#Disable-caching) altogether.


## Getting Started

#### Initialization
You need to pass Redux Store to ng-redux via ```$ngReduxProvider``` :

```JS
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

bootstrap(
  App,
  [bind('ngRedux').toFactory(() => {
   	return new ngRedux(store);
   })]
);
```

#### Usage
```JS
@Component(...)
@View(...)
class SmartComponent {

  constructor(@Inject('ngRedux') ngRedux) {
    this._ngRedux = ngRedux;
    ngRedux.connect(state => state.counter, counter => this.counter = counter);
  }

  onInit() {
    this.actions = bindActionCreators(CounterActions, this._ngRedux.getStore().dispatch);
  }

  onDestroy() {
    this._ngRedux.disconnect();
  }
}
```

##### Note: The callback provided to ```connect``` will be called once directly after creation to allow initialization of your component states



You can also grab multiple slices of the state by passing an array of selectors:

```JS
  ngRedux.connect([
  state => state.todos,
  state => state.users
  ],
  (todos, users) => { 
      this.todos = todos
      this.users = users;
  });
```


#### Accessing Redux' Store
You don't need to create another service to get hold of Redux's store (although you can).
You can access the store via ```ngRedux.getStore()```:

```JS
redux.bindActionCreators(actionCreator, ngRedux.getStore().dispatch);
```

#### Disabling caching
Each time Redux's Store update, ng-redux will check if the slices specified via 'selectors' have changed, and if so will execute the provided callback.
You can disable this behaviour, and force the callback to be executed even if the slices didn't change by setting ```disableCaching``` to true:

```JS
reduxConnector.connect(state => state.todos, todos => this.todos = todos, true);
```
