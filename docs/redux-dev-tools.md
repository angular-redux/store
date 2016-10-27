# Using DevTools

Ng2Redux is fully compatible with the Chrome extension version of the Redux dev
tools:

https://github.com/zalmoxisus/redux-devtools-extension

However, due to peculiarities of Angular 2's change detection logic,
events that come from external tools don't trigger a refresh in Angular's
zone.

We've taken the liberty of providing a wrapper around the extension
tools that handles this for you.

Here's how to hook the extension up to your app:

```typescript
import { NgReduxModule, NgRedux, DevToolsExtension } from 'ng2-redux';

// Add the dev tools enhancer your ngRedux.configureStore called
// when you initialize your root component:
@NgModule({
  /* ... */
  imports: [ /* ... */, NgReduxModule.forRoot() ]
})export class AppModule {
  constructor(
    private ngRedux: NgRedux,
    private devTools: DevToolsExtension) {

    let enhancers = [];
    // ... add whatever other enhancers you want.

    // You probably only want to expose this tool in devMode.
    if (__DEVMODE__ && devTools.isEnabled()) {
      enhancers = [ ...enhancers, devTools.enhancer() ];
    }

    this.ngRedux.configureStore(
      rootReducer,
      initialState,
      [],
      enhancers);
  }
}
```

`ReduxDevTools.enhancer()` takes the same options parameter as
documented here: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#windowdevtoolsextensionconfig
