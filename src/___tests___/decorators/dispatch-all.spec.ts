import 'reflect-metadata';
import { expect, use } from 'chai';
import { createStore } from 'redux';
import { NgRedux } from '../../components/ng-redux';
import { dispatchAll } from '../../decorators';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

use(sinonChai);

function mockActionCreator() {
  return {
    type: 'INCREMENT_COUNTER'
  };
}

let anotherMockPayload = { type: 'ANOTHER_ACTION' };

describe('@dispatchAll', () => {

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

  const actionCreatorsObject = {
    mockActionCreator: mockActionCreator,
    anotherFunction: () => anotherMockPayload,
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

  it('configures the attached methods to call dispatch with the result ' +
     'from their action creator', () => {
    let dispatchSpyMock = sinon.spy();
    connector.dispatch = dispatchSpyMock;

    mockInstance.mockActionCreator();
    mockInstance.anotherFunction();

    expect(connector.dispatch.calledTwice).to.be.true;
    expect(connector.dispatch.getCall(0).args[0]).to.eql(mockActionCreator());
    expect(connector.dispatch.getCall(1).args[0]).to.eql(anotherMockPayload);
  });

});
