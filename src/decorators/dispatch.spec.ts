import { Reducer, Action } from 'redux';
import { NgZone } from '@angular/core';
import { NgRedux } from '../components/ng-redux';
import { RootStore } from '../components/root-store';
import { dispatch } from './dispatch';
import { WithSubStore } from './with-sub-store';

class MockNgZone {
  run = (fn: Function) => fn()
}

interface IAppState {
  value: string;
  instanceProperty?: string;
}

type PayloadAction = Action & { payload?: IAppState };

describe('@dispatch', () => {
  let ngRedux;
  const mockNgZone = new MockNgZone() as NgZone;
  let defaultState: IAppState;
  let rootReducer: Reducer<IAppState>;

  beforeEach(() => {
    defaultState = {
      value: 'init-value',
      instanceProperty: 'init-instanceProperty'
    };

    rootReducer = (state = defaultState, action: PayloadAction) => {
      switch (action.type) {
        case 'TEST':
          const { value = null, instanceProperty = null } = action.payload || {};
          return Object.assign({}, state, { value, instanceProperty });
        default:
          return state;
      }
    };

    ngRedux = new RootStore(mockNgZone);
    ngRedux.configureStore(rootReducer, defaultState);
    spyOn(NgRedux.instance, 'dispatch');
  });

  describe('on the RootStore', () => {
    class TestClass {
      instanceProperty = 'test'

      @dispatch() externalFunction: (value: string) => PayloadAction;

      @dispatch() classMethod(value: string): PayloadAction {
        return {
          type: 'TEST',
          payload: { value, instanceProperty: this.instanceProperty }
        }
      }

      @dispatch() boundProperty = (value: string): PayloadAction => ({
        type: 'TEST',
        payload: { value, instanceProperty: this.instanceProperty }
      })
    }

    let instance: TestClass;

    beforeEach(() => {
      instance = new TestClass();
    });

    it('should call dispatch with the result of the function', () => {
      const result = instance.classMethod('class method');
      const expectedArgs = {
        type: 'TEST',
        payload: {
          value: 'class method',
          instanceProperty: 'test'
        }
      };
      expect(result.type).toBe('TEST');
      expect(result.payload && result.payload.value).toBe('class method');
      expect(result.payload && result.payload.instanceProperty).toBe('test');
      expect(NgRedux.instance).toBeTruthy();
      expect(NgRedux.instance && NgRedux.instance.dispatch)
        .toHaveBeenCalledWith(expectedArgs)
    });

    it('should work with property initalizers', () => {
      const result = instance.boundProperty('bound property');
      const expectedArgs = {
        type: 'TEST',
        payload: {
          value: 'bound property',
          instanceProperty: 'test'
        }
      }
      expect(result.type).toBe('TEST');
      expect(result.payload && result.payload.value).toBe('bound property');
      expect(result.payload && result.payload.instanceProperty).toBe('test');
      expect(NgRedux.instance).toBeTruthy();
      expect(NgRedux.instance && NgRedux.instance.dispatch)
        .toHaveBeenCalledWith(expectedArgs)
    });

    it('work with properties bound to function defined outside of the class', () => {
      const instanceProperty = 'test';
      function externalFunction(value: string) {
        return {
          type: 'TEST',
          payload: {
            value,
            instanceProperty,
          }
        }
      }
      instance.externalFunction = externalFunction;
      const result = instance.externalFunction('external function');
      const expectedArgs = {
        type: 'TEST',
        payload: {
          value: 'external function',
          instanceProperty: 'test'
        }
      }
      expect(result.type).toBe('TEST');
      expect(result.payload && result.payload.value).toBe('external function');
      expect(result.payload && result.payload.instanceProperty).toBe('test');
      expect(NgRedux.instance).toBeTruthy();
      expect(NgRedux.instance && NgRedux.instance.dispatch)
        .toHaveBeenCalledWith(expectedArgs)
    });
  });

  describe('On a substore', () => {
    const localReducer = (state: any, _: Action) => state;
    @WithSubStore({
      basePathMethodName: 'getBasePath',
      localReducer,
    })
    class TestClass {
      getBasePath = () => [ 'bar', 'foo' ]

      @dispatch() decoratedActionCreator(value: string): PayloadAction {
        return {
          type: 'TEST',
          payload: { value },
        }
      }
    }

    beforeEach(() => {
      instance = new TestClass();
    });

    let instance: TestClass;

    it('scopes decorated actions to the base path', () => {
      instance.decoratedActionCreator('hello');

      expect(NgRedux.instance && NgRedux.instance.dispatch)
        .toHaveBeenCalledWith({
          type: 'TEST',
          payload: { value: 'hello' },
          '@angular-redux::fractalkey': '["bar","foo"]',
        });
    });
  });
});
