import { Component } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { CounterActions } from '../actions/counter.actions';
import { RandomNumberService } from '../services/random-number.service';

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
  <p>foo$: {{ foo$ | async | json }}</p>
  <p>bar$: {{ bar$ | async }}</p>
  `
})
export class Counter {
  @select('counter') counter$: Observable<number>;
  @select([ 'pathDemo', 'foo' ]) foo$: Observable<Object>;
  @select([ 'pathDemo', 'foo', 'bar', 0 ]) bar$: Observable<number>;

  constructor(private actions: CounterActions) {}
}
