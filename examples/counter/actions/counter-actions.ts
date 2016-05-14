import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import * as Redux from 'redux';
import { RootState } from '../store';
import { RandomNumberService } from '../services/random-number';

/**
 * Action creators in Angular 2. We may as well adopt a more
 * class-based approach to satisfy Angular 2's OOP idiom. It
 * has the advantage of letting us use the dependency injector
 * as a replacement for redux-thunk.
 */
@Injectable()
export class CounterActions {
  constructor (
    private ngRedux: NgRedux<RootState>,
    private randomNumberService: RandomNumberService) {}

  static INCREMENT_COUNTER: string = 'INCREMENT_COUNTER';
  static DECREMENT_COUNTER: string = 'DECREMENT_COUNTER';
  static RANDOMIZE_COUNTER: string = 'RANDOMIZE_COUNTER';

  increment(): void {
    this.ngRedux.dispatch({ type: CounterActions.INCREMENT_COUNTER });
  }

  decrement(): void {
    this.ngRedux.dispatch({ type: CounterActions.DECREMENT_COUNTER });
  }

  incrementIfOdd(): void {
    const { counter } = this.ngRedux.getState();
    if (counter % 2 !== 0) {
      this.increment();
    }
  }

  incrementAsync(delay: number = 1000): void {
    setTimeout(this.increment.bind(this), delay);
  }
  
  randomize(): void {
    this.ngRedux.dispatch({
      type: CounterActions.RANDOMIZE_COUNTER,
      payload: this.randomNumberService.pick()
    });
  }
}
