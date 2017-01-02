import { Component } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { CounterActions } from './counter.actions';
import { RandomNumberService } from '../common/random-number.service';
import { IAppState } from '../store';

/**
 * A component demonstraing a basic counter with actions and the
 * select decorator.
 */
@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
})
export class CounterComponent {
  @select() counter$: Observable<number>;
  @select('counter') counterByName$: Observable<number>;

  constructor(
    public actions: CounterActions,
    private ngRedux: NgRedux<IAppState>) {}
}

