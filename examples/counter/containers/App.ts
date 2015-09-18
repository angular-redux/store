import {Component, View, onInit, onDestroy} from 'angular2/angular2';
import {bindActionCreators} from 'redux';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import { Inject } from 'angular2/di';

@Component({
  selector: 'root',
  lifecycle: [onInit, onDestroy],
  bindings: []
})
@View({
  directives: [Counter],
  template: `
  <counter [counter]="counter"
    [increment]="increment"
    [decrement]="decrement"
    [increment-If-Odd]="incrementIfOdd"
    [increment-Async]="incrementAsync">
  </counter>
  <dev
  `
})
export default class App {

  protected unsubscribe: Function;

  constructor( @Inject('ngRedux') ngRedux, @Inject('devTools') devTools) {
    devTools.start(ngRedux);
    this.unsubscribe = ngRedux.connect(this.mapState, this.mapDispatch)(this);
  }

  onInit() {}

  onDestroy() {
    this.unsubscribe();
  }

  mapState(state) {
    return {
      counter: state.counter
    };
  }

  mapDispatch(dispatch) {
    return bindActionCreators(CounterActions, dispatch);
  }
}
