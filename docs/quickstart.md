## Installation

`@angular-redux/store` has a peer dependency on redux, so we need to install it as well.

```sh
npm install --save redux @angular-redux/store
```

## Quick Start

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './containers/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
```
Import the `NgReduxModule` class and add it to your application module as an
`import`. Once you've done this, you'll be able to inject `NgRedux` into your
Angular components. In your top-level app module, you
can configure your Redux store with reducers, initial state,
and optionally middlewares and enhancers as you would in Redux directly.

```typescript
import { NgReduxModule, NgRedux } from '@angular-redux/store';
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
import { NgReduxModule, NgRedux } from '@angular-redux/store';
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

Now your Angular app has been reduxified! Use the `@select` decorator to
access your store state, and `.dispatch()` to dispatch actions:

```typescript
import { select } from '@angular-redux/store';

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
