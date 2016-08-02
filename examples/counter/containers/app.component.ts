import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NgRedux, DevToolsExtension } from 'ng2-redux';

import { Counter } from '../components/counter.component';
import { CounterInfo } from '../components/counter-info.component';
import { Search } from '../components/search.component';
import { IAppState, rootReducer, enhancers } from '../store/index';
const createLogger = require('redux-logger');

@Component({
  selector: 'root',
  directives: [ Counter, CounterInfo, Search ],
  pipes: [ AsyncPipe ],
  providers: [ DevToolsExtension ],
  template: `
  <h3>Counter example</h3>
  <counter></counter>
  <counter-info></counter-info>

  <h3>String length example</h3>
  <search></search>
  <search-info></search-info>
  `
})
export class App {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private devTool: DevToolsExtension) {
    // Do this once in the top-level app component.
    this.ngRedux.configureStore(
      rootReducer,
      {},
      [ createLogger() ],
      [ ...enhancers, devTool.isEnabled() ? devTool.enhancer() : f => f]);
  }
}
