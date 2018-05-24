import { NgZone } from '@angular/core';
import { Action, AnyAction } from 'redux';
import { RootStore } from './root-store';
import { NgRedux } from './ng-redux';
import { ObservableStore } from './observable-store';
import { take, toArray } from 'rxjs/operators';

class MockNgZone extends NgZone {
  run<T>(fn: (...args: any[]) => T): T {
    return fn() as T;
  }
}

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
  const defaultReducer = (state: any, _: Action) => state;

  const basePath = ['foo', 'bar'];
  let ngRedux: NgRedux<IAppState>;
  let subStore: ObservableStore<ISubState>;

  beforeEach(() => {
    ngRedux = new RootStore<IAppState>(new MockNgZone({
      enableLongStackTrace: false,
    }) as NgZone);
    ngRedux.configureStore(defaultReducer, {
      foo: {
        bar: { wat: { quux: 3 } },
      },
    });

    subStore = ngRedux.configureSubStore<ISubState>(basePath, defaultReducer);
  });

  it('adds a key to actions it dispatches', () =>
    expect(subStore.dispatch<AnyAction>({ type: 'MY_ACTION' })).toEqual({
      type: 'MY_ACTION',
      '@angular-redux::fractalkey': '["foo","bar"]',
    }));

  it('gets state rooted at the base path', () =>
    expect(subStore.getState()).toEqual({ wat: { quux: 3 } }));

  it('selects based on base path', () =>
    subStore.select('wat').subscribe(wat => expect(wat).toEqual({ quux: 3 })));

  it(`handles property selection on a base path that doesn't exist yet`, () => {
    const nonExistentSubStore = ngRedux.configureSubStore(
      ['sure', 'whatever'],
      (state: any, action: any) => ({ ...state, value: action.newValue })
    );
    nonExistentSubStore
      .select<any>('value')
      .pipe(take(2), toArray())
      .subscribe(v => expect(v).toEqual([undefined, 'now I exist']));
    nonExistentSubStore.dispatch<AnyAction>({
      type: 'nvm',
      newValue: 'now I exist',
    });
  });

  it(`handles path selection on a base path that doesn't exist yet`, () => {
    const nonExistentSubStore = ngRedux.configureSubStore(
      ['sure', 'whatever'],
      (state: any, action: any) => ({ ...state, value: action.newValue })
    );
    nonExistentSubStore
      .select<any>(['value'])
      .pipe(take(2), toArray())
      .subscribe(v => expect(v).toEqual([undefined, 'now I exist']));
    nonExistentSubStore.dispatch<AnyAction>({
      type: 'nvm',
      newValue: 'now I exist',
    });
  });

  it(`handles function selection on a base path that doesn't exist yet`, () => {
    const nonExistentSubStore = ngRedux.configureSubStore(
      ['sure', 'whatever'],
      (state: any, action: any) => ({ ...state, value: action.newValue })
    );
    nonExistentSubStore
      .select(s => (s ? s.value : s))
      .pipe(take(2), toArray())
      .subscribe(v => expect(v).toEqual([undefined, 'now I exist']));
    nonExistentSubStore.dispatch<AnyAction>({
      type: 'nvm',
      newValue: 'now I exist',
    });
  });

  it('can create its own sub-store', () => {
    const subSubStore = subStore.configureSubStore(['wat'], defaultReducer);
    expect(subSubStore.getState()).toEqual({ quux: 3 });
    subSubStore.select('quux').subscribe(quux => expect(quux).toEqual(3));

    expect(subSubStore.dispatch<AnyAction>({ type: 'MY_ACTION' })).toEqual({
      type: 'MY_ACTION',
      '@angular-redux::fractalkey': '["foo","bar","wat"]',
    });
  });
});
