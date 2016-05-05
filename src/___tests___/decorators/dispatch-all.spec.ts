import 'reflect-metadata';
import {expect, use} from 'chai';
import { createStore } from 'redux';
import {dispatchAll} from '../../decorators';
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


  describe('@dispatchAll', () => {

    const actionCreatorsObject = {
      mockActionCreator: mockActionCreator,
      anotherFunction: () => ({ type: 'ANOTHER_ACTION' }),
      thisShouldNotBeBound: 'I`m a string not a function'
    };

    @dispatchAll(actionCreatorsObject)
    class MockClass {
      mockActionCreator;
      anotherFunction;
      thisShouldNotBeBound; // typescripted
    }

    let mockInstance = new MockClass();

    it('attaches all functions on the given object, to the decorated class',
      () => {
        expect(mockInstance.mockActionCreator).to.be.instanceOf(Function);
        expect(mockInstance.anotherFunction).to.be.instanceOf(Function);
      });

    it('only attaches functions, ignoring anything else on the object', () => {
      expect(mockInstance.thisShouldNotBeBound).to.be.undefined;
    });

    it('wraps the action creator in a dispatch call', () => {
      expect(mockInstance.mockActionCreator)
        .to.not.equal(actionCreatorsObject.mockActionCreator);
      expect(mockInstance.anotherFunction)
        .to.not.equal(actionCreatorsObject.anotherFunction);
    });

  });

});
