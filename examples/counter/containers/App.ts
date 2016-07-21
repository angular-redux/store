import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NgRedux, DevToolsExtension } from 'ng2-redux';

import { Counter } from '../components/Counter';
import { CounterInfo } from '../components/CounterInfo';
import { Search } from '../components/search.component';
import { SearchInfo } from '../components/search-info.component';
import { RootState, enhancers } from '../store';

import reducer from '../reducers/index';
const createLogger = require('redux-logger');

@Component({
    selector: 'root',
    directives: [Counter, CounterInfo, Search, SearchInfo],
    pipes: [AsyncPipe],
    providers: [ DevToolsExtension ],
    template: `   
    <br/>
    <counter></counter>
    <counter-info></counter-info>
    <search-info></search-info>
    <search></search>
  `

})
export class App {
    constructor(
        private ngRedux: NgRedux<any>,
        private devTool: DevToolsExtension) {
        // Do this once in the top-level app component.
        this.ngRedux.configureStore(
            reducer,
            {},
            [ createLogger() ],
            devTool.isEnabled() ?
                [ ...enhancers, devTool.enhancer() ] :
                enhancers);
    }
}
