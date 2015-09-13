import {Component, View, ON_PUSH} from 'angular2/angular2';

@Component({
  selector: 'counter',
  changeDetection: ON_PUSH,
  properties: [
    'counter',
    'increment',
    'decrement',
    'incrementIfOdd',
    'incrementAsync'
  ]
})
@View({
  directives: [],
  template: `
  <p>
    Clicked: {{ counter }} times
    <button (^click)="increment()">+</button>
    <button (^click)="decrement()">-</button>
    <button (^click)="incrementIfOdd()">Increment if odd</button>
    <button (^click)="incrementAsync()">Increment async</button>
  </p>
  `
})
export class Counter {
  constructor() {}
}
