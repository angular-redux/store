import { NgZone } from '@angular/core';
import { async } from '@angular/core/testing'
import { Action } from 'redux';
import { RootStore } from './root-store';
import { NgRedux } from './ng-redux';
import { ObservableStore } from './observable-store';

class MockNgZone { run = (fn: Function) => fn() }

interface ISubState {
  wat: {
    quux: number;
  };
}

interface IAppState {
  foo: {
    bar: ISubState;
  };
}

describe('Substore', () => {
  const defaultReducer = (state: any, action: Action) => state;

  const basePath = ['foo', 'bar'];
  let ngRedux: NgRedux<IAppState>;
  let subStore: ObservableStore<ISubState>;

  beforeEach(() => {
    ngRedux = new RootStore<IAppState>(new MockNgZone() as NgZone);
    ngRedux.configureStore(defaultReducer, {
      foo: {
        bar: { wat: { quux: 3 } },
      }
    });

    subStore = ngRedux.configureSubStore<ISubState>(basePath, defaultReducer);
  });

  it('adds a key to actions it dispatches', () =>
    expect(subStore.dispatch({ type: 'MY_ACTION' }))
      .toEqual({
        type: 'MY_ACTION',
        '@angular-redux::fractalkey': '["foo","bar"]'
      }));

  it('gets state rooted at the base path', () =>
    expect(subStore.getState()).toEqual({ wat: { quux: 3 } }));

  it('selects based on base path', () =>
    subStore.select('wat').subscribe(wat =>
      expect(wat).toEqual({ quux: 3 })));

  it('can create its own sub-store', () => {
    const subSubStore = subStore.configureSubStore(['wat'], defaultReducer);
    expect(subSubStore.getState()).toEqual({ quux: 3 });
    subSubStore.select('quux').subscribe(quux =>
      expect(quux).toEqual(3));

    expect(subSubStore.dispatch({ type: 'MY_ACTION' }))
      .toEqual({
        type: 'MY_ACTION',
      '@angular-redux::fractalkey': '["foo","bar","wat"]'});
  });
});
