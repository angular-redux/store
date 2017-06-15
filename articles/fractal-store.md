# Fractal Stores

As of 6.4.0, `@angular-redux/store` supports 'subStores'. A subStore expose
the same interface as the main Redux store (`dispatch`, `select`, etc.),
but is rooted at a particular path in your global state.

In particular, this is useful for Elm-inspired 'fractal components': 
Components that have instance-specific access to Redux features.

For example, imagine your store looked like this:

```typescript
{ 
  users: {
    bob: {
      name: 'Bob Smith',
      occupation: 'Programmer',
      loc: 1023,
    },
    alice: {
      name: 'Alice Jones',
      occupation: 'DevOps Specialist',
      loc: 2314,
    }
  }
}
```

It would be nice to have a 'UserComponent' that could be instanciated for both Alice and Bob and operate independently on the two relevant parts of the
store.

We can do this by creating substores whose 'base paths' point to Alice and Bob's portions of the store:

```typescript
interface IUser {
  name: string,
  occupation: string,
  loc: number,
};

export const userComponentReducer = (state, action) =>
  action.type === 'ADD_LOC' ?
  { ...state, loc: state.loc + action.payload } :
  state;

@Component({
  selector: 'user',
  template: `
    <p>name: {{ name$ |async }}</p>
    <p>occupation: {{ occupation$ | async }}</p>
    <p>lines of code: {{ loc$ | async }}</p>
    <button (click)=addCode(100)>Add 100 lines of code</button>
  `,
})
export class UserComponent implements NgOnInit {
  @Input() userId: String;

  name$: Observable<string>;
  occupation$: Observable<string>;
  loc$: Observable<number>;

  private subStore: ObservableStore<IUser>;

  constructor(private ngRedux: NgRedux) {}

  onInit() {
    // The reducer passed here will affect state under `users.${userID}`
    // in the top-level store.
    this.subStore = this.ngRedux.configureSubStore(
      ['users', userId],
      userComponentReducer);

    // Substore selectons are scoped to the base path used to configure
    // the substore.
    this.name$ = this.subStore.select('name');
    this.occupation$ = this.subStore.select('occupation');
    this.loc$ = this.subStore.select(s => s.loc || 0);
  }

  addCode(numLines) {
    // Dispatching from the sub-store ensures this component instance's
    // subStore only sees the 'ADD_LOC' action.
    this.subStore.dispatch({ type: 'ADD_LOC', payload: numLines });
  }
}
```

```html
<user [userId]='alice'></user>
<user [userId]='bob'></user>
```

This way, we use the same type of component for both Alice and Bob, but
they act independently of each other in different parts of the global
store state.

You can even nest fractal stores by calling `configureSubStore` on an
existing subStore.

## What about @select, @select$, @dispatch?

As of 6.5.0, the decorator interface has been expanded to support fractal
stores as well.

Tag your component or service with the `@WithSubStore` decorator, and a substore will be
configured behind the scenes; instance of that class's `@select`, `@select$`, and `@dispatch` decorators will now operate on that substore instead of the root store. Reworking the
example above with the decorator interface looks like this:

```typescript
interface IUser {
  name: string,
  occupation: string,
  loc: number,
};

export const userComponentReducer = (state, action) =>
  action.type === 'ADD_LOC' ?
  { ...state, loc: state.loc + action.payload } :
  state;

export const defaultToZero = (obs$: Observable<number>) =>
  obs$.map(n => n || 0);

@Component({
  selector: 'user',
  template: `
    <p>name: {{ name$ |async }}</p>
    <p>occupation: {{ occupation$ | async }}</p>
    <p>lines of code: {{ loc$ | async }}</p>
    <button (click)=addCode(100)>Add 100 lines of code</button>
  `,
})
@WithSubStore({
  basePathMethodName: 'getBasePath',
  localReducer: userComponentReducer,
})
export class UserComponent implements NgOnInit {
  @Input() userId: String;

  // The substore will be created at the first non-falsy path returned
  // from this function.
  getBasePath(): PathSelector | null {
    return this.userId ? ['users', userId] : null;
  }

  // These selections are now scoped to the portion of the store rooted
  // at ['users', userId];
  @select('name')                readonly name$: Observable<string>;
  @select('occupation')          readonly occupation$: Observable<string>;
  @select$('loc', defaultToZero) readonly loc$: Observable<number>;

  // These dispatches will be scoped to the substore as well, as if you
  // had called ngRedux.configureSubStore(...).dispatch(numLines).
  @dispatch()
  addCode(numLines) {
    // Dispatching from the sub-store ensures this component instance's
    // subStore only sees the 'ADD_LOC' action.
    return { type: 'ADD_LOC', payload: numLines };
  }
}
```