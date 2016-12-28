import { Component } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { CounterActions } from './counter.actions';
import { RandomNumberService } from '../common/random-number.service';
import { IAppState } from '../store';

@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
})
export class CounterComponent {
  @select('counter') counter$: Observable<number>;
  @select([ 'pathDemo', 'foo' ]) foo$: Observable<Object>;
  @select([ 'pathDemo', 'foo', 'bar', 0 ]) bar$: Observable<number>;

  constructor(
    public actions: CounterActions,
    private ngRedux: NgRedux<IAppState>) {}
}
