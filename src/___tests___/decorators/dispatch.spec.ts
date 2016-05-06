import 'reflect-metadata';
import {expect, use} from 'chai';
import { createStore } from 'redux';
import {NgRedux} from '../../components/ng-redux';
import {dispatch} from '../../decorators';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as _ from 'lodash';

use(sinonChai);

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

  it('configures the attached method to call dispatch with the result ' +
     'from the action creator', () => {

    let dispatchSpyMock = sinon.spy();
    connector.dispatch = dispatchSpyMock;

    class MockClass {
      @dispatch(mockActionCreator) anInstanceMethod;
    }
    const mockInstance = new MockClass();
    mockInstance.anInstanceMethod();

    expect(connector.dispatch.calledOnce).to.be.true;
    expect(connector.dispatch.getCall(0).args[0]).to.eql(mockActionCreator());

  });

});


