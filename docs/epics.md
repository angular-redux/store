# Side-Effect Management Using Epics

Ng2-Redux also works well with the `Epic` feature of
[redux-observable](https://github.com/redux-observable). For
example, a common use case for a side-effect is making an API call; while
we can use asynchronous actions for this, epics provide a much cleaner
approach.

Consider the following example of a user login implementation. First, we
create some trivial actions:

**session.actions.ts:**

```typescript
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../reducers';

@Injectable()
export class SessionActions {
  static LOGIN_USER = 'LOGIN_USER';
  static LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
  static LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';
  static LOGOUT_USER = 'LOGOUT_USER';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  loginUser(credentials) {
    this.ngRedux.dispatch({
      type: SessionActions.LOGIN_USER,
      payload: credentials,
    });
  };

  logoutUser() {
    this.ngRedux.dispatch({ type: SessionActions.LOGOUT_USER });
  };
} 
```

Next, we create an `@Injectable SessionEpic` service:

**session.epics.ts:**

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActionsObservable } from 'redux-observable';
import { SessionActions } from '../actions/session.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const BASE_URL = '/api';

@Injectable()
export class SessionEpics {
  constructor(private http: Http) {}

  login = (action$: ActionsObservable) => {
    return action$.ofType(SessionActions.LOGIN_USER)
      .flatMap(({payload}) => {
        return this.http.post(`${BASE_URL}/auth/login`, payload)
          .map(result => ({
            type: SessionActions.LOGIN_USER_SUCCESS,
            payload: result.json().meta
          }))
          .catch(error => Observable.of({
            type: SessionActions.LOGIN_USER_ERROR
          }));
        });
  }
}
```

This needs to be a service so that we can inject Angular's `HTTP` service.
However in this case we're using the same "arrow function bind trick" as we
did for the dependency-injected middleware cookbook above.

This allows us to configure our Redux store with the new epic as follows:

**app.component.ts:**

```typescript
import { NgModule } from '@angular/core';
import { NgReduxModule, NgRedux } from 'ng2-redux';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './reducers';
import { SessionEpics } from './epics';

@NgModule({
  /* ... */
  imports: [ /* ... */, NgReduxModule.forRoot() ],
  providers: [
    SessionEpics,
    /* ... */
  ]
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private epics: SessionEpics) {

      const middleware = [
        createEpicMiddleware(this.epics.login)
      ];
      ngRedux.configureStore(rootReducer, {}, middleware);
  }
}
```

Now, whenever you dispatch a "USER_LOGIN" action, the epic will trigger the
HTTP request, and fire a corresponding success or failure action. This allows
you to keep your action creators very simple, and to cleanly describe your
side effects as a set of simple RxJS epics.
