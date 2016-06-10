import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NgRedux, select } from 'ng2-redux';

import { Counter } from '../components/Counter';
import { CounterInfo } from '../components/CounterInfo';
import { RootState, enhancers } from '../store';

import reducer from '../reducers/index';
const createLogger = require('redux-logger');

@Component({
    selector: 'root',
    directives: [Counter, CounterInfo],
    pipes: [AsyncPipe],
    template: `
    <counter></counter>
    <counter-info></counter-info>
  `
})
export class App {

    constructor(private ngRedux: NgRedux<RootState>) {

        // Do this once in the top-level app component.
        this.ngRedux.configureStore(
            reducer,
            { counter: 0 },
            [ createLogger() ],
            enhancers
        );

    }

}
