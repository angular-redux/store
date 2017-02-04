# Strongly Typed Reducers

It's good practice in typescript to be as specific about your types as possible.
This helps you catch errors at compile-time instead of run-time.

Reducers are no exception to this rule. However it's not always obvious how to
make this happen in practice.

## Reducer Typing Best Practices

### Define an Interface for your State

It's important to strongly type the data in your store, and this is done by
defining types for the `state` arguments to your reducers:

```typescript
export type TFoo: string;

// Being explicit about the state argument and return types ensures that all your
// reducer's cases return the correct type.
export const fooReducer = (state: TFoo, action): TFoo => {
  // ...
};

export interface IBar {
  a: number;
  b: string;
}

export const barReducer = (state: IBar, action): IBar => {
  // ...
};
```

Since most applications are composed of several reducers, you should compose
a global 'AppState' by composing the reducer types:

```typescript
export interface IAppState {
  foo?: TFoo;
  bar?: IBar;
}

export const rootReducer = combineReducers({
  foo: fooReducer,
  bar: barReducer
});
```

This 'app state' is what you should use when injecting `NgRedux`:

```typescript
import { Injectable } from '@angular/core';
import { IAppState } from './store';

@Injectable()
export class MyActionService {
  constructor(private ngRedux: NgRedux<IAppState>) {}

  // ...
}
```

### Consider Using Built-In Types from Redux

Redux ships with a good set of official typings; consider using them. In
particular, consider importing and using the `Action` and `Reducer` types:

```typescript
import { Action, Reducer } from 'redux';

export const fooReducer: Reducer<TFoo> = (state: TFoo, action: Action): TFoo => {
  // ...
};
```

Note that we supply this reducer's state type as a generic type parameter to `Reducer<T>`.

### Consider using 'Flux Standard Actions' (FSAs)

[FSA](https://github.com/acdlite/flux-standard-action/blob/master/src/index.js)
is a widely-used convention for defining the shape of actions. You can import
in into your project and use it:

```sh
npm install --save flux-standard-action @types/flux-standard-action
```

Flux standard actions take 'payload', and 'error' parameters in addition to the
basic `type`.  Payloads in particular help you strengthen your reducers even
further:

```typescript
import { Reducer } from 'redux';
import { Action } from 'flux-standard-action';

export const fooReducer: Reducer<TFoo> = (state: TFoo, action: Action<TFoo>): TFoo => {
  // ...
};
```

Here we're saying that the action's payload must have type TFoo.
If you need more flexibility in payload types, you can use a union and
[type assertions](https://www.typescriptlang.org/docs/handbook/advanced-types.html):

```typescript
export const barReducer: Reducer<IBar> = (state: IBar, action: Action<number | string>): IBar => {
  switch(action.type) {
    case A_HAS_CHANGED:
      return Object.assign({}, state, {
        a: <number>action.payload
      });
    case B_HAS_CHANGED:
      return Object.assign({}, state, {
        b: <string>action.payload
      });
    // ...
  }
};
```

For more complex union-payload scenarios, Typescript's [type-guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html) may also be helpful.

### Use a Typed Wrapper around Object.assign

In the Babel world, reducers often use `Object.assign` or property spread to
maintain immutability. This works in Typescript too, but it's not typesafe:

```typescript
export const barReducer: Reducer<IBar> = (state: IBar, action: Action<number | string>): IBar => {
  switch(action.type) {
    case A_HAS_CHANGED:
      return Object.assign({}, state, {
        a: <number>action.payload,
        zzz: 'test' // We'd like this to generate a compile error, but it doesn't
      });
    // ...
  }
};
```

Ideally, we'd like this code to fail because `zzz` is not a property of the state.
However, the built-in type definitions for `Object.assign` return an intersection
type, making this legal. This makes sense for general usage of `Object.assign`,
but it's not what we want in a reducer.

Instead, we've provided a type-corrected immutable assignment function, [`tassign`](https://npmjs.com/package/tassign),
that will catch this type of error:

```typescript
import { tassign } from 'tassign';

export const barReducer: Reducer<IBar> = (state: IBar, action: Action<number | string>): IBar => {
  switch(action.type) {
    case A_HAS_CHANGED:
      return tassign(state, {
        a: <number>action.payload,
        zzz: 'test' // Error: zzz is not a property of IBar
      });
    // ...
  }
};
```

Following these tips to strengthen your reducer typings will go a long way
towards more robust code.
