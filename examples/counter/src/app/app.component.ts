import { Component } from '@angular/core';
import { NgRedux, DevToolsExtension } from '@angular-redux/core';
import { IAppState, rootReducer, enhancers } from '../store/index';
const createLogger = require('redux-logger');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
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
