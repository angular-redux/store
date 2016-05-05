import 'reflect-metadata';
import {expect, use} from 'chai';
import { createStore } from 'redux';
import {NgRedux} from '../../components/ng-redux';
import {select} from '../../decorators/select';
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

 
  describe('@select', () => {

    let ngRedux;
    let targetObj;
    let defaultState;
    let rootReducer;
    let mockAppRef;
  
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
      mockAppRef = {
        tick: sinon.spy()
      };
      ngRedux = new NgRedux(mockAppRef);
      ngRedux.configureStore(rootReducer, defaultState);
    });

    describe('when left empty', () => {

      it('automatically attempts to bind to a store property that matches the' +
         ' name of the class property', () => {

        class MockClass {
          @select() foo: any;
        }

        let mockInstance = new MockClass();

        expect(mockInstance.foo.subscribe).to.be.instanceOf(Function);

      });

      it('attempts to bind by name ignoring any $ characters in the class ' +
         'property name', () => {

         class MockClass {
          @select() foo$: any;
        }

        let mockInstance = new MockClass();

        expect(mockInstance.foo$.subscribe).to.be.instanceOf(Function);

      });

    });

    describe('when passed a string', () => {

      it('attempts to bind to the store property whose name matches the ' +
         'string value', () => {

        class MockClass {
          @select('foo') asdf: any;
        }

        let mockInstance = new MockClass();

        expect(mockInstance.asdf.subscribe).to.be.instanceOf(Function);

      });

    });

    describe('when passed a function', () => {

      it('attempts to use that function as the selector function', () => {

        class MockClass {
          @select(state => state.foo) asdf: any;
        }

        let mockInstance = new MockClass();

        expect(mockInstance.asdf.subscribe).to.be.instanceOf(Function);

      });

    });

  });

});
