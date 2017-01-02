import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select as select } from 'ng2-redux';
import 'rxjs/add/operator/combineLatest';

export function x(state) {
  return state.counter;
}

export function y(state) {
  return state.counter * 2;
}

interface ICoord {
  x: number;
  y: number;
}

/**
 * A component demonstrating how you can use various methods to
 * transform the data selected from the store.
 */
@Component({
  selector: 'counter-info',
  templateUrl: './counter-info.component.html', 
})
export class CounterInfoComponent {

  @select(x) funcCounter$: Observable<number>;
  @select('counter') stringKey$: Observable<number>;
  @select(y) counterX2$: Observable<number>;
  foo: ICoord;

  ngOnInit() {
    this.counterX2$
      .combineLatest(
        this.stringKey$,
        (x: number, y: number) => ({ x: x * 2, y: y * 3 }))
      .subscribe((c: ICoord) => this.foo = c);
  }
}
