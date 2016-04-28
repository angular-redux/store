import {Component, Inject, OnDestroy, ApplicationRef} from 'angular2/core';
import {Observable} from 'rxjs';
import {AsyncPipe} from 'angular2/common';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import {NgRedux} from 'ng2-redux';

import {RootState} from '../store/configureStore';

@Component({
    selector: 'root',
    directives: [Counter],
    pipes: [AsyncPipe],
    template: `
  <counter [counter]="counter$| async"
    [increment]="increment"
    [decrement]="decrement"
    [incrementIfOdd]="incrementIfOdd"
    [incrementAsync]="incrementAsync">
  </counter>
  `
})

export class App {
    
    counter$: any;
    unsubscribe: () => void;

    // Will be added to instance with mapDispatchToTarget

    increment: () => any;
    decrement: () => any;

    constructor(
        private ngRedux: NgRedux<RootState>,
        private applicationRef: ApplicationRef) {}

    ngOnInit() {
        let {increment, decrement } = CounterActions;
        this.counter$ = this.ngRedux
            .select(state => state.counter)
        this.ngRedux.mapDispatchToTarget({ increment, decrement })(this);

        this.unsubscribe = this.ngRedux.subscribe(() => {
          this.applicationRef.tick();
        });
    }

    ngOnDestroy() {
        this.unsubscribe();
    }

    // Can also call ngRedux.dispatch directly

    incrementIfOdd = () => this.ngRedux
        .dispatch(<any>CounterActions.incrementIfOdd());

    incrementAsync = () => this.ngRedux
        .dispatch(<any>CounterActions.incrementAsync());

}
