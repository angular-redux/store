# API

## `configureStore()`

Adds your ngRedux store to NgRedux. This should be called once, typically in
your top-level app component's constructor.

__Arguments:__

* `rootReducer` \(*Reducer*): Your top-level Redux reducer.
* `initialState` \(*Object): The desired initial state of your store.
* `middleware` \(*Middleware[]*): An optional array of Redux middleware
functions.
* `enhancers` \(*StoreEnhancer[StoreEnhancer]*): An optional array of Redux
store enhancer functions.

## select(key | function, [comparer]) => Observable

Exposes a slice of state as an observable. Accepts either a property name or a
selector function.

__Arguments:__

* `key` \(*string*): A key within the state that you want to subscribe to.
* `selector` \(*Function*): A function that accepts the application state, and
returns the slice you want subscribe to for changes.

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

## `provideStore()`

Initializes your ngRedux store. This should be called once, typically in your
top-level app component's constructor. If `configureStore`
has been used this cannot be used.

__Arguments:__

* `store` \(*Store*): Your app's store, as created by Redux's `createStore`
function.

## @select(key | path | function)

Property decorator.

Attaches an observable to the property which will reflect the latest value in
the Redux store.

__Arguments:__

* `key` \(*string*): A key within the state that you want to subscribe to.
* `path` \(*string[]*): A path of nested keys within the state you want to
subscribe to.
* `selector` \(*Function*): A function that accepts the application state, and
returns the slice you want to subscribe to for changes.

e.g. see [the @select decorator](#the-select-decorator)

## `connect(mapStateToTarget, mapDispatchToTarget)(target)`

Connects an Angular component to Redux, and maps action creators and store
properties onto the component instance.

__Arguments:__
* `mapStateToTarget` \(*Function*): connect will subscribe to Redux store
updates. Any time it updates, mapStateToTarget will be called. Its result must
be a plain object, and it will be merged into `target`. If you have a component
which simply triggers actions without needing any state you can pass null to
`mapStateToTarget`.
* [`mapDispatchToTarget`] \(*Object* or *Function*): Optional. If an object is
passed, each function inside it will be assumed to be a Redux action creator. An
object with the same function names, but bound to a Redux store, will be merged
onto `target`. If a function is passed, it will be given `dispatch`. It’s up to
you to return an object that somehow uses `dispatch` to bind action creators in
your own way. (Tip: you may use the
[`bindActionCreators()`](http://gaearon.github.io/redux/docs/api/bindActionCreators.html)
helper from Redux.).

*You then need to invoke the function a second time, with `target` as parameter:*
* `target` \(*Object* or *Function*): If passed an object, the results of
`mapStateToTarget` and `mapDispatchToTarget` will be merged onto it. If passed a
function, the function will receive the results of `mapStateToTarget` and
`mapDispatchToTarget` as parameters.

e.g:
```typescript
connect(this.mapStateToThis, this.mapDispatchToThis)(this);
//Or
connect(this.mapState, this.mapDispatch)((selectedState, actions) => {/* ... */});
```

__Remarks:__
* The `mapStateToTarget` function takes a single argument of the entire Redux
store’s state and returns an object to be passed as props. It is often called a
selector. Use reselect to efficiently compose selectors and compute derived
data.

## Store API
All of redux's store methods (i.e. `dispatch`, `subscribe` and `getState`) are
exposed by $ngRedux and can be accessed directly. For example:

```typescript
ngRedux.subscribe(() => {
    let state = $ngRedux.getState();
    //...
})
```

This means that you are free to use Redux basic API in advanced cases where
`connect`'s API would not fill your needs.
