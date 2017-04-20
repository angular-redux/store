import 'reflect-metadata';
import { NgZone } from '@angular/core';

import { NgRedux } from '../components/ng-redux';
import { select } from './select';

class MockNgZone {
  run(fn) {
    return fn();
  }
}

describe('@select', () => {
  let ngRedux;
  let mockNgZone = new MockNgZone() as NgZone;
  let targetObj;
  let defaultState;
  let rootReducer;

  beforeEach(() => {
    defaultState = {
      foo: 'bar',
      baz: -1
    };
    rootReducer = (state = defaultState, action) => {
      const newState = Object.assign({}, state, { baz: action.payload });
      return newState;
    };
    targetObj = {};
    ngRedux = new NgRedux(mockNgZone);
    ngRedux.configureStore(rootReducer, defaultState);
  });

  describe('when passed no arguments', () => {
    it('automatically attempts to bind to a store property that matches the' +
       ' name of the class property', () => {

      class MockClass {
        @select() baz: any;
      }

      let mockInstance = new MockClass();
      let value;
      let expectedValue = 1;

      mockInstance.baz.subscribe((val) => {
        value = val;
      });

      ngRedux.dispatch({type: 'nvm', payload: expectedValue});

      expect(value).toEqual(expectedValue);
    });

    it('attempts to bind by name ignoring any $ characters in the class ' +
       'property name', () => {

      class MockClass {
        @select() baz$: any;
      }

      let mockInstance = new MockClass();
      let value;
      let expectedValue = 2;

      mockInstance.baz$.subscribe((val) => {
        value = val;
      });

      ngRedux.dispatch({type: 'nvm', payload: expectedValue});

      expect(value).toEqual(expectedValue);
    });
  });

  describe('when passed a string', () => {
    it('attempts to bind to the store property whose name matches the ' +
       'string value', () => {

      class MockClass {
        @select('baz') asdf: any;
      }

      let mockInstance = new MockClass();
      let value;
      let expectedValue = 3;

      mockInstance.asdf.subscribe((val) => {
        value = val;
      });

      ngRedux.dispatch({type: 'nvm', payload: expectedValue});

      expect(value).toEqual(expectedValue);
    });
  });

  describe('when passed a function', () => {

    it('attempts to use that function as the selector function', () => {

      class MockClass {
        @select(state => state.baz * 2) asdf: any;
      }

      let mockInstance = new MockClass();
      let value;
      let expectedValue = 10;

      mockInstance.asdf.subscribe((val) => {
        value = val;
      });

      ngRedux.dispatch({type: 'nvm', payload: expectedValue / 2});

      expect(value).toEqual(expectedValue);
    });
  });

  describe('when passed a comparer', () => {

    function comparer(x: any, y: any): boolean {
      return y === 1;
    }

    it('should not trigger next when comparer returns true', () => {

      class MockClass {
        @select(state => state.baz, comparer) asdf: any;
      }

      const mockInstance = new MockClass();

      mockInstance.asdf.subscribe(val => {
        expect(val).not.toEqual(1);
      });
      ngRedux.dispatch({type: 'nvm', payload: 1});
    });

    it('should trigger next when comparer returns false', () => {

      class MockClass {
        @select(state => state.baz, comparer) asdf: any;
      }

      const mockInstance = new MockClass();
      let value;

      mockInstance.asdf.subscribe(val => {
        value = val;
      });
      ngRedux.dispatch({type: 'nvm', payload: 2});
      expect(value).toEqual(2);
    });

    it('should receive previous and next value for comparison', () => {
      const spy = jasmine.createSpy('spy');

      class MockClass {
        @select(state => state.baz, spy) asdf: any;
      }

      const mockInstance = new MockClass();
      mockInstance.asdf.subscribe(val => null);

      ngRedux.dispatch({type: 'nvm', payload: 1});
      ngRedux.dispatch({type: 'nvm', payload: 2});

      expect(spy).toHaveBeenCalledWith(undefined, 1);
      expect(spy).toHaveBeenCalledWith(1, 2);
    });
  });
});
