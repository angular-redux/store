# The Select Pattern

The select pattern allows you to get slices of your state as RxJS observables.

These plug in very efficiently to Angular's change detection mechanism and this is the
preferred approach to accessing store data in Angular.

## The @select decorator

The `@select` decorator can be added to the property of any class or angular
component/injectable. It will turn the property into an observable which observes
the Redux Store value which is selected by the decorator's parameter.

The decorator expects to receive a `string`, an array of `string`s, a `function` or no
parameter at all.

- If a `string` is passed the `@select` decorator will attempt to observe a store
property whose name matches the `string`.
- If an array of strings is passed, the decorator will attempt to match that path
through the store (similar to `immutableJS`'s `getIn`).
- If a `function` is passed the `@select` decorator will attempt to use that function
as a selector on the RxJs observable.
- If nothing is passed then the `@select` decorator will attempt to use the name of the class property to find a matching value in the Redux store. Note that a utility is in place here where any $ characters will be ignored from the class property's name.

```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

@Component({
    selector: 'counter-value-printed-many-times',
    template: `
    <p>{{counter$ | async}}</p>
    <p>{{counter | async}}</p>
    <p>{{counterSelectedWithString | async}}</p>
    <p>{{counterSelectedWithFunction | async}}</p>
    <p>{{counterSelectedWithFunctionAndMultipliedByTwo | async}}</p>
    `
})
export class CounterValue {

    // this selects `counter` from the store and attaches it to this property
    // it uses the property name to select, and ignores the $ from it
    @select() counter$;

    // this selects `counter` from the store and attaches it to this property
    @select() counter;

    // this selects `counter` from the store and attaches it to this property
    @select('counter') counterSelectedWithString;

    // this selects `pathDemo.foo.bar` from the store and attaches it to this
    // property.
    @select(['pathDemo', 'foo', 'bar']) pathSelection;

    // this selects `counter` from the store and attaches it to this property
    @select(state => state.counter) counterSelectedWithFunction;

    // this selects `counter` from the store and multiples it by two
    @select(state => state.counter * 2)
    counterSelectedWithFuntionAndMultipliedByTwo: Observable<any>;
}
```

## Select Without Decorators

If you like RxJS, but aren't comfortable with decorators, you can also make
store selections using the `ngRedux.select()` function.

```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Counter } from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import { NgRedux } from '@angular-redux/store';

interface IAppState {
  counter: number;
};

@Component({
    selector: 'root',
    template: `
  <counter [counter]="counter$| async"
    [increment]="increment"
    [decrement]="decrement">
  </counter>
  `
})
export class Counter {
  private count$: Observable<number>;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  ngOnInit() {
    let {increment, decrement } = CounterActions;
    this.counter$ = this.ngRedux.select('counter');
  }

  incrementIfOdd = () => this.ngRedux.dispatch(
    <any>CounterActions.incrementIfOdd());

  incrementAsync = () => this.ngRedux.dispatch(
    <any>CounterActions.incrementAsync());
}
```

`ngRedux.select` can take a property name or a function which transforms a property.
Since it's an observable, you can also transform data using observable operators like
`.map`, `.filter`, etc.

## The @sselect$ decorator

The `@select$` decorator works similar to `@select`, however you are able to specify observable chains to execute on the selected result.

```typescript
import { select$ } from 'angular-redux/store';

export const debounceAndTriple = obs$ => obs$
  .debounce(300)
  .map(x => 3 * x);

class Foo {
  @select$(['foo', 'bar'], debounceAndTriple)
  readonly debouncedFooBar$: Observable<number>;
}
```
