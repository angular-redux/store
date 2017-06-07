import 'reflect-metadata';
import { NgZone } from '@angular/core';
import { NgRedux } from '../components/ng-redux';
import { dispatch } from './dispatch';


class MockNgZone {
  run = fn => fn()
}

describe('@dispatch', () => {
  let ngRedux;
  const mockNgZone = new MockNgZone() as NgZone;
  let defaultState;
  let rootReducer;

  beforeEach(() => {
    defaultState = {
      value: 'init-value',
      instanceProperty: 'init-instanceProperty'
    };
    rootReducer = (state = defaultState, action) => {
      switch (action.type) {
        case 'TEST':
          const { value, instanceProperty } = action.payload;
          return Object.assign({}, state, { value, instanceProperty });
        default:
          return state;
      }

    };
    ngRedux = new NgRedux(mockNgZone);
    ngRedux.configureStore(rootReducer, defaultState);
  });

  it('should call dispatch with the result of the function', () => {
    spyOn(NgRedux.instance, 'dispatch');
    const instance = new TestClass();
    const result = instance.classMethod('class method');
    const expectedArgs = {
      type: 'TEST',
      payload: {
        value: 'class method',
        instanceProperty: 'test'
      }
    }
    expect(result.type).toBe('TEST');
    expect(result.payload.value).toBe('class method');
    expect(result.payload.instanceProperty).toBe('test');
    expect(NgRedux.instance).toBeTruthy();
    expect(NgRedux.instance && NgRedux.instance.dispatch)
      .toHaveBeenCalledWith(expectedArgs)
  });

  it('should work with property initalizers', () => {

    spyOn(NgRedux.instance, 'dispatch');
    const instance = new TestClass();
    const result = instance.boundProperty('bound property');
    const expectedArgs = {
      type: 'TEST',
      payload: {
        value: 'bound property',
        instanceProperty: 'test'
      }
    }
    expect(result.type).toBe('TEST');
    expect(result.payload.value).toBe('bound property');
    expect(result.payload.instanceProperty).toBe('test');
    expect(NgRedux.instance).toBeTruthy();
    expect(NgRedux.instance && NgRedux.instance.dispatch)
      .toHaveBeenCalledWith(expectedArgs)
  })

  it('work with properties bound to function defined outside of the class', () => {
    spyOn(NgRedux.instance, 'dispatch');
    const instanceProperty = 'test';
    function externalFunction(value) {
      return {
        type: 'TEST',
        payload: {
          value,
          instanceProperty,
        }
      }
    }
    const instance = new TestClass();
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
    expect(result.payload.value).toBe('external function');
    expect(result.payload.instanceProperty).toBe('test');
    expect(NgRedux.instance).toBeTruthy();
    expect(NgRedux.instance && NgRedux.instance.dispatch)
      .toHaveBeenCalledWith(expectedArgs)
  })

  class TestClass {
    instanceProperty = 'test'
    @dispatch()
    externalFunction;
    @dispatch()
    classMethod(value) {
      return {
        type: 'TEST',
        payload: {
          value,
          instanceProperty: this.instanceProperty
        }
      }
    }

    @dispatch()
    boundProperty = (value) => {
      return {
        type: 'TEST',
        payload: {
          value,
          instanceProperty: this.instanceProperty
        }
      }
    }
  }
});
