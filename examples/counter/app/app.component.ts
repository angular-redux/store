import { Component } from '@angular/core';
import { NgRedux, DevToolsExtension } from 'ng2-redux';
import { IAppState, rootReducer, enhancers } from '../store/index';
const createLogger = require('redux-logger');

@Component({
  selector: 'root',
  template: `
  <h3>Counter example</h3>
  <counter></counter>
  <counter-info></counter-info>

  <h3>String length example</h3>
  <search></search>
  `
})
export class App {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private devTool: DevToolsExtension) {

    this.ngRedux.configureStore(
      rootReducer,
      {},
      [ createLogger() ],
      [ ...enhancers, devTool.isEnabled() ? devTool.enhancer() : f => f]);
  }
}
