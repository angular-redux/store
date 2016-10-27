# Using Angular 2 Services in your Middleware

Again, we just want to use Angular DI the way it was meant to be used.

Here's a contrived example that fetches a name from a remote API using Angular's
`Http` service:

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LogRemoteName {
  constructor(private http: Http) {}

  middleware = store => next => action => {
    console.log('getting user name');
    this.http.get('http://jsonplaceholder.typicode.com/users/1')
      .map(response => {
        console.log('got name:', response.json().name);
        return next(action);
      })
      .catch(err => console.log('get name failed:', err));
    }
}
```

As with the action example above, we've attached our middleware function to
an `@Injectable` class that can itself receive services from Angular's
dependency injector.

Note the arrow function called `middleware`: this is what we can pass to the
middlewares parameter when we initialize ngRedux in our top-level component. We
use an arrow function to make sure that what we pass to ngRedux has a
properly-bound function context.

```typescript
import { NgModule } from '@angular/core';
import { NgReduxModule, NgRedux } from 'ng2-redux';
import reduxLogger from 'redux-logger';
import { LogRemoteName } from './middleware/log-remote-name';

@NgModule({
  /* ... */
  imports: [ /* ... */, NgReduxModule.forRoot() ],
  providers: [
    LogRemoteName,
    /* ... */
  ]
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    logRemoteName: LogRemoteName) {

    const middleware = [ reduxLogger(), logRemoteName.middleware ];
    this.ngRedux.configureStore(rootReducer, {}, middleware);
  }
}
```
