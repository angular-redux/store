import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgRedux, DevToolsExtension} from 'ng2-redux';
import { CounterActions } from '../actions/counter.actions';
import { SearchActions } from '../actions/search.actions';
import { App } from './app.component.ts';
import { CounterInfo } from '../components/counter-info.component';
import { Counter } from '../components/counter.component';
import { Search } from '../components/search.component';
import { IAppState, rootReducer, enhancers } from '../store/index';
const createLogger = require('redux-logger');

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
  ],
  declarations: [
    App,
    CounterInfo,
    Counter,
    Search,
  ],
  bootstrap: [ App ],
  providers: [
    DevToolsExtension,
    NgRedux,
    CounterActions,
    SearchActions,
  ]
})
export class AppModule {
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
