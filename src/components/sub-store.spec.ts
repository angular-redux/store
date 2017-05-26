import { NgZone } from '@angular/core';
import { async } from '@angular/core/testing'
import { NgRedux } from './ng-redux';

class MockNgZone { run = fn => fn() }

describe('Substore', () => {
  const defaultReducer = (state, action) => state;
  const ngRedux = new NgRedux(new MockNgZone() as NgZone);
  ngRedux.configureStore(defaultReducer, {
    foo: {
      bar: { wat: { quux: 3 } },
    }
  });

  const basePath = ['foo', 'bar'];
  const subStore = ngRedux.configureSubStore(basePath, defaultReducer);

  it('adds a key to actions it dispatches', () =>
    expect(subStore.dispatch({ type: 'MY_ACTION' }))
      .toEqual({
        type: 'MY_ACTION',
        '@angular-redux::fractalkey': '["foo","bar"]'
      }));

  it('gets state rooted at the base path', () =>
    expect(subStore.getState()).toEqual({ wat: { quux: 3 } }));

  it('selects based on base path', async(() =>
    subStore.select('wat').subscribe(wat =>
      expect(wat).toEqual({ quux: 3 }))));

  it('can create its own sub-store', async() => {
    const subSubStore = subStore.configureSubStore(['wat'], defaultReducer);
    expect(subSubStore.getState()).toEqual({ quux: 3 });
    subSubStore.select('quux').subscribe(quux =>
      expect(quux).toEqual(3));

    // TODO: fix.
    expect(subSubStore.dispatch({ type: 'MY_ACTION' }))
      .toEqual({
        type: 'MY_ACTION',
      '@angular-redux::fractalkey': '["foo","bar","wat"]'});
  });
});
