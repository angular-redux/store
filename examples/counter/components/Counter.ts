import { Component } from '@angular/core';
import { NgRedux,
         dispatchAll,
         select } from 'ng2-redux';
import * as CounterActions from '../actions/CounterActions';

@Component({
  selector: 'counter',
  template: `
  <p>
    Clicked: {{ counter$ | async }} times
    <button (click)="increment()">+</button>
    <button (click)="decrement()">-</button>
    <button (click)="incrementIfOdd()">Increment if odd</button>
    <button (click)="incrementAsync()">Increment async</button>
  </p>
  `
})
@dispatchAll(CounterActions)
export class Counter {
    @select() counter$: any;
}
