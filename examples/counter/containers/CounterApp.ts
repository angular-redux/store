import {Component, View, onInit, onDestroy} from 'angular2/angular2';
import {bindActionCreators} from 'redux';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import { Inject } from 'angular2/di';

@Component({
  selector: 'counter-app',
  lifecycle: [onInit, onDestroy],
  bindings: []
})
@View({
  directives: [Counter],
  template: `
  <counter [counter]="counter"
    [increment]="increment"
    [decrement]="decrement"
    [increment-If-Odd]="incrementIfOdd"></counter>
  `
})
export class CounterApp {

  protected unsubscribe: Function;

  constructor( @Inject('ngRedux') ngRedux) {
    this.unsubscribe = ngRedux.connect(this.mapStateToScope, this.mapDispatchToProps)(this);
  }

  onInit() {}

  onDestroy() {
    this.unsubscribe();
  }

  mapStateToScope(state) {
    return {
      counter: state.counter
    };
  }

  mapDispatchToProps(dispatch) {
    return bindActionCreators(CounterActions, dispatch);
  }
}
