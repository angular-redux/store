import {Component, View, onInit, onDestroy} from 'angular2/angular2';
import {bindActionCreators} from 'redux';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import  Connector from '../redux/connector';
import { Inject } from 'angular2/di';

@Component({
  selector: 'counter-app',
  lifecycle: [onInit, onDestroy],
  bindings: []
})
@View({
  directives: [ Counter ],
  template: `
  <counter [counter]="counter" [actions]="actions"></counter>
  `
})
export class CounterApp {
  actions: any;
  unsubscribe: Function;
  counter;
  _ngRedux;

  constructor(@Inject('ngRedux') ngRedux) {
    this._ngRedux = ngRedux;
    ngRedux.connect(state => state.counter, counter => this.counter = counter, true);
  }


  onInit() {
    this.actions = bindActionCreators(CounterActions, this._ngRedux.getStore().dispatch);
  }

  onDestroy() {
    this._ngRedux.disconnect();
  }
}
