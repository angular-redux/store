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

Passing no argument will bind the resulting observable to a top-level store
property with the same name as the decorated variable.

E.g. `@select() foo$` will create bind `this.foo$` to an Observable of `state.foo`.

## .select(key | path | function)

Non-decorator selector function. Does the same thing as `@select`, but with the
following differences:

* It's not a decorator; you call it explicitly on `ngRedux`:

```typescript
class Foo {
  constructor(ngRedux: NgRedux) {
    this.myObservable = ngRedux.select(['foo', 'bar']);
  }
}
```

* Calling it with no arguments will give you an observable to the entire
redux state.

Use this version if you're uncomfortable with decorators or need to observe
the full store.

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
