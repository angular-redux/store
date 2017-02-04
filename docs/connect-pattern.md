# The Connect Pattern

Alternately you can use the 'ngRedux.connect' API, which will map your state and action creators
to the component class directly.

This pattern is provided for backwards compatibility. It's worth noting that
Angular 2's view layer is more optimized for Observables and the `select`
pattern above.

```typescript
import { Component } from '@angular/core';
import { Counter } from '../components/Counter';
import { NgRedux } from '@angular-redux/core';
import { bindActionCreators } from 'redux';

export interface IAppState {
  counter: number;
};

// NB: 'import * as CounterActions' won't provide the right type
// for bindActionCreators.
const CounterActions = require('../actions/CounterActions');

@Component({
    selector: 'root',
    directives: [Counter],
    template: `
  <counter [counter]="counter"
    [increment]="actions.increment"
    [decrement]="actions.decrement">
  </counter>
  `
})
export class Counter {
  private counter: number;

  constructor(private ngRedux: NgRedux<IAppState>) {
    ngRedux.connect(this.mapStateToTarget, this.mapDispatchToThis)(this);
  }

  ngOnDestroy() {
    this.disconnect();
  }

  // Will result in this.counter being set to the store value of counter
  // after each change.
  mapStateToTarget(state) {
    return { counter: state.counter };
  }

  // Will result in a method being created on the component for each
  // action creator, which dispatches to the store when called.
  mapDispatchToThis(dispatch) {
    return { actions: bindActionCreators(CounterActions, dispatch) };
  }
}
```

## A Note about Internet Explorer

This library relies on the presence of `Object.assign` and `Array.forEach`.
Internet Explorer requires polyfills for these; however these same functions
are also needed for Angular 2 itself to work.  Just make sure you include
[core-js](https://npmjs.com/package/core-js) or [es6-shim](https://npmjs.com/packages/es6-shim)
if you need to support IE.
