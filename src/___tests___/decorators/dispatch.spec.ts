import 'reflect-metadata';
import {expect, use} from 'chai';
import { createStore } from 'redux';
import {NgRedux} from '../../components/ng-redux';
import {dispatch} from '../../decorators';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as _ from 'lodash';

use(sinonChai);

function returnPojo() {
  return {};
}

class MockApplicationRef {
  tick: () => void;
}




describe('Decorator Interface', () => {

  function mockActionCreator() {
    return {
      type: 'INCREMENT_COUNTER'
    };
  }

  describe('@dispatch', () => {

    let store;
    let connector;
    let targetObj;
    let defaultState;

    beforeEach(() => {
      defaultState = {
        foo: 'bar',
        baz: -1
      };
      store = createStore((state = defaultState, action) => {
        const newState = Object.assign({}, state, { baz: action.payload });
        return newState;
      });
      targetObj = {};
      connector = new NgRedux(store);
    });


    it('attaches an instance method on the decorated property', () => {

      class MockClass {
        @dispatch(mockActionCreator) anInstanceMethod;
      }
      const mockInstance = new MockClass();
      expect(mockInstance.anInstanceMethod).to.be.instanceOf(Function);

    });

  });


});
