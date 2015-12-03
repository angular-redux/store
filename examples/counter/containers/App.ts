import {Component, View, onDestroy} from 'angular2/angular2';
import {bindActionCreators} from 'redux';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import { Inject } from 'angular2/angular2';

@Component({
  selector: 'root',
  lifecycle: [onDestroy]
})
@View({
  directives: [Counter],
  template: `
  <counter [counter]="counter"
    [increment]="increment"
    [decrement]="decrement"
    [increment-if-odd]="incrementIfOdd"
    [increment-async]="incrementAsync">
  </counter>
  `
})
export default class App {

  protected unsubscribe: Function;

  constructor( @Inject('ngRedux') ngRedux, @Inject('devTools') devTools) {
    devTools.start(ngRedux);
    this.unsubscribe = ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  onDestroy() {
    this.unsubscribe();
  }

  mapStateToThis(state) {
    return {
      counter: state.counter
    };
  }

  mapDispatchToThis(dispatch) {
    return bindActionCreators(CounterActions, dispatch);
  }
}
