# Using Angular Services in your Action Creators

In order to use services in action creators, we need to integrate
them into Angular's dependency injector.

We may as well adopt a more class-based approach to satisfy
Angular 2's OOP idiom, and to allow us to

1. make our actions `@Injectable()`, and
2. inject other services for our action creators to use.

Take a look at this example, which injects NgRedux to access
`dispatch` and `getState` (a replacement for `redux-thunk`),
and a simple `RandomNumberService` to show a side effect.

```typescript
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import * as Redux from 'redux';
import { RootState } from '../store';
import { RandomNumberService } from '../services/random-number';

@Injectable()
export class CounterActions {
  constructor (
    private ngRedux: NgRedux<RootState>,
    private randomNumberService: RandomNumberService) {}

  static INCREMENT_COUNTER: string = 'INCREMENT_COUNTER';
  static DECREMENT_COUNTER: string = 'DECREMENT_COUNTER';
  static RANDOMIZE_COUNTER: string = 'RANDOMIZE_COUNTER';

  // Basic action
  increment(): void {
    this.ngRedux.dispatch({ type: CounterActions.INCREMENT_COUNTER });
  }

  // Basic action
  decrement(): void {
    this.ngRedux.dispatch({ type: CounterActions.DECREMENT_COUNTER });
  }

  // Async action.
  incrementAsync(delay: number = 1000): void {
    setTimeout(this.increment.bind(this), delay);
  }

  // State-dependent action
  incrementIfOdd(): void {
    const { counter } = this.ngRedux.getState();
    if (counter % 2 !== 0) {
      this.increment();
    }
  }

  // Service-dependent action
  randomize(): void {
    this.ngRedux.dispatch({
      type: CounterActions.RANDOMIZE_COUNTER,
      payload: this.randomNumberService.pick()
    });
  }
}
```

To use these action creators, we can just go ahead and inject
them into our component:

```typescript
import { Component } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { CounterActions } from '../actions/counter-actions';
import { RandomNumberService } from '../services/random-number';

@Component({
  selector: 'counter',
  providers: [ CounterActions, RandomNumberService ],
  template: `
  <p>
    Clicked: {{ counter$ | async }} times
    <button (click)="actions.increment()">+</button>
    <button (click)="actions.decrement()">-</button>
    <button (click)="actions.incrementIfOdd()">Increment if odd</button>
    <button (click)="actions.incrementAsync(2222)">Increment async</button>
    <button (click)="actions.randomize()">Set to random number</button>
  </p>
  `
})
export class Counter {
  @select('counter') counter$: any;

  constructor(private actions: CounterActions) {}
}
```
