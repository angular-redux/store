import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from 'ng2-redux';
import 'rxjs/add/operator/combineLatest';

interface ICoord {
  x: number;
  y: number;
}

@Component({
  selector: 'counter-info',
  template: `
  <ul>
    <li>{{ funcCounter$ | async }}</li>
    <li>{{ stringKey$ | async }}</li>
    <li>{{ counterX2$ | async }}</li>
    <li>{{ foo?.x }} - {{ foo?.y }}</li>
  <ul>
  `
})
export class CounterInfo {

  @select(state => state.counter) funcCounter$: Observable<number>;
  @select('counter') stringKey$: Observable<number>;
  @select(state => state.counter * 2) counterX2$: Observable<number>;
  foo: ICoord;

  ngOnInit() {
    this.counterX2$
      .combineLatest(
        this.stringKey$,
        (x: number, y: number) => ({ x: x * 2, y: y * 3 }))
      .subscribe((c: ICoord) => this.foo = c);
  }
}
