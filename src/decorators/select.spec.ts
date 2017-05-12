import 'reflect-metadata';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/take';
import { NgRedux } from '../components/ng-redux';
import { select, select$ } from './select';

class MockNgZone { run = fn => fn() }

describe('Select decorators', () => {
  let ngRedux;
  let targetObj;

  const mockNgZone = new MockNgZone() as NgZone;
  const defaultState = { foo: 'bar', baz: -1 };

  const rootReducer = (state = defaultState, action) =>
    action.payload ?
      Object.assign({}, state, { baz: action.payload }) :
      state;

  beforeEach(() => {
    targetObj = {};
    ngRedux = new NgRedux(mockNgZone);
    ngRedux.configureStore(rootReducer, defaultState);
  });

  describe('@select', () => {
    describe('when passed no arguments', () => {
      it('binds to a store property that matches the name of the class property', done => {
        class MockClass { @select() baz: Observable<number>; }
        const mockInstance = new MockClass();

        mockInstance.baz
          .take(2)
          .toArray()
          .subscribe(values => expect(values).toEqual([-1, 1]),
            null,
            done);
        ngRedux.dispatch({type: 'nvm', payload: 1});
      });

      it('binds by name ignoring any $ characters in the class property name', done => {
        class MockClass { @select() baz$: Observable<number>; }
        const mockInstance = new MockClass();

        mockInstance.baz$
          .take(2)
          .toArray()
          .subscribe(values => expect(values).toEqual([-1, 4]),
            null,
            done);
        ngRedux.dispatch({type: 'nvm', payload: 4});
      });
    });

    describe('when passed a string', () => {
      it('binds to the store property whose name matches the string value', done => {
        class MockClass { @select('baz') obs$: Observable<number>; }
        const mockInstance = new MockClass();

        mockInstance.obs$
          .take(2)
          .toArray()
          .subscribe(values => expect(values).toEqual([-1, 3]),
            null,
            done);
        ngRedux.dispatch({type: 'nvm', payload: 3});
      });
    });

    describe('when passed a function', () => {
      it('attempts to use that function as the selector function', done => {
        const selector = state => state.baz * 2;
        class MockClass { @select(selector) obs$: Observable<number>; }
        const mockInstance = new MockClass();

        mockInstance.obs$
          .take(2)
          .toArray()
          .subscribe(values => expect(values).toEqual([-2, 10]),
            null,
            done);
        ngRedux.dispatch({type: 'nvm', payload: 5});
      });
    });

    describe('when passed a comparator', () => {
      const comparator = (x: any, y: any): boolean => y === 1;
      class MockClass { @select('baz', comparator) baz$: Observable<number> };

      it('should only trigger next when comparator returns true', done => {
        const mockInstance = new MockClass();
        mockInstance.baz$
          .take(2)
          .toArray()
          .subscribe(
            values => expect(values).toEqual([-1, 2]),
            null,
            done);
        ngRedux.dispatch({type: 'nvm', payload: 1});
        ngRedux.dispatch({type: 'nvm', payload: 2});
      });

      it('should receive previous and next value for comparison', done => {
        const spy = jasmine.createSpy('spy');
        class MockClass { @select('baz', spy) baz$: Observable<number>; }

        const mockInstance = new MockClass();
        mockInstance
          .baz$
          .take(3)
          .subscribe(null, null, done);

        ngRedux.dispatch({type: 'nvm', payload: 1});
        ngRedux.dispatch({type: 'nvm', payload: 2});

        expect(spy).toHaveBeenCalledWith(-1, 1);
        expect(spy).toHaveBeenCalledWith(1, 2);
      });
    });
  });

  describe('@select$', () => {
    const transformer = baz$ => baz$.map(baz => 2 * baz);

    it('applies a transformer to the observable', done => {
      class MockClass { @select$('baz', transformer) baz$: Observable<number>; }
      const mockInstance = new MockClass();

      mockInstance.baz$
        .take(2)
        .toArray()
        .subscribe(
          values => expect(values).toEqual([-2, 10]),
          null,
          done);
      ngRedux.dispatch({type: 'nvm', payload: 5});
    });

    describe('when passed a comparator', () => {
      const comparator = (x: any, y: any): boolean => y === 1;
      class MockClass { @select$('baz', transformer, comparator) baz$: Observable<number> }

      it('should only trigger next when the comparator returns true', done => {
        const mockInstance = new MockClass();
        mockInstance.baz$
          .take(2)
          .toArray()
          .subscribe(
            values => expect(values).toEqual([-2, 2]),
            null,
            done);
        ngRedux.dispatch({type: 'nvm', payload: 1});
        ngRedux.dispatch({type: 'nvm', payload: 2});
      });

      it('should receive previous and next value for comparison', done => {
        const spy = jasmine.createSpy('spy');
        class SpyClass { @select$('baz', transformer, spy) baz$: Observable<number> };

        const mockInstance = new SpyClass();
        mockInstance.baz$
          .take(3)
          .subscribe(null, null, done);

        ngRedux.dispatch({type: 'nvm', payload: 1});
        ngRedux.dispatch({type: 'nvm', payload: 2});

        expect(spy).toHaveBeenCalledWith(-2, 2);
        expect(spy).toHaveBeenCalledWith(2, 4);
      });
    });
  });
});
