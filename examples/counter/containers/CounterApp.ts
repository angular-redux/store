import {Component, View, onInit, onDestroy} from 'angular2/angular2';
import {bindActionCreators} from 'redux';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import Connector from '../redux/connector';
import { Inject } from 'angular2/di';

@Component({
  selector: 'counter-app',
  lifecycle: [onInit, onDestroy],
  bindings: []
})
@View({
  directives: [Counter],
  template: `
  <counter [counter]="counter" [actions]="actions"></counter>
  `
})
export class CounterApp {
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
    return { actions: bindActionCreators(CounterActions, dispatch) };
  }
}
