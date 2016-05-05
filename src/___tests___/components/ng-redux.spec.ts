import 'reflect-metadata';
import 'es6-shim';
import { expect, use } from 'chai';
import { createStore } from 'redux';
import { NgRedux } from '../../components/ng-redux';
import { dispatch } from '../../components/dispatch';
import { dispatchAll } from '../../components/dispatchAll';
import { select } from '../../components/select';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

use(sinonChai);

function returnPojo() {
  return {};
}

class MockApplicationRef {
  tick: () => void;
}

describe('Connector', () => {
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

  it('Should throw when target is not a Function or a plain object', () => {
    expect(ngRedux.connect(returnPojo).bind(ngRedux, 15))
      .to.throw(Error);
    expect(ngRedux.connect(returnPojo).bind(ngRedux, undefined))
      .to.throw(Error);
    expect(ngRedux.connect(returnPojo).bind(ngRedux, 'test'))
      .to.throw(Error);

    expect(ngRedux.connect(returnPojo).bind(ngRedux, {}))
      .not.to.throw(Error);
    expect(ngRedux.connect(returnPojo).bind(ngRedux, returnPojo))
      .not.to.throw(Error);
  });

  it('Should throw when selector does not return a plain object', () => {
    expect(ngRedux.connect.bind(ngRedux, state => state.foo))
      .to.throw(Error);
  });


  it('Should extend target (Object) with selected state once directly after ' +
    'creation', () => {
      ngRedux.connect(
        () => ({
          vm: { test: 1 }
        }))(targetObj);

      expect(targetObj.vm).to.deep.equal({ test: 1 });
    });

  it('Should update the target (Object) passed to connect when the store ' +
    'updates', () => {
      ngRedux.connect(state => state)(targetObj);
      ngRedux.dispatch({ type: 'ACTION', payload: 0 });
      expect(targetObj.baz).to.equal(0);
      ngRedux.dispatch({ type: 'ACTION', payload: 7 });
      expect(targetObj.baz).to.equal(7);
    });

  it('Should prevent unnecessary updates when state does not change ' +
    '(shallowly)', () => {
      ngRedux.connect(state => state)(targetObj);
      ngRedux.dispatch({ type: 'ACTION', payload: 5 });

      expect(targetObj.baz).to.equal(5);

      targetObj.baz = 0;

      // This should not replace our mutation, since the state didn't change.
      ngRedux.dispatch({ type: 'ACTION', payload: 5 });

      expect(targetObj.baz).to.equal(0);
    });

  it('Should extend target (object) with actionCreators', () => {
    ngRedux.connect(returnPojo,
      { ac1: returnPojo, ac2: () => { } })(targetObj);
    expect(targetObj.ac1).to.be.a('Function');
    expect(targetObj.ac2).to.be.a('Function');
  });

  it('Should return an unsubscribing function', () => {
    const unsubscribe = ngRedux.connect(state => state)(targetObj);
    ngRedux.dispatch({ type: 'ACTION', payload: 5 });

    expect(targetObj.baz).to.equal(5);
    unsubscribe();

    ngRedux.dispatch({ type: 'ACTION', payload: 7 });

    expect(targetObj.baz).to.equal(5);
  });

  it('Should provide dispatch to mapDispatchToTarget when receiving a ' +
    'Function', () => {
      let receivedDispatch;

      ngRedux.connect(
        returnPojo, dispatch => { receivedDispatch = dispatch; })(targetObj);
      expect(receivedDispatch).to.be.a('Function');
    });
});

describe('NgRedux Observable Store', () => {
  interface IAppState {
    foo: string;
    bar: string;
    baz: number;
  };
  
  let connector;
  let targetObj;
  let defaultState;
  let rootReducer;
  let ngRedux;
  let mockAppRef;

  beforeEach(() => {
    defaultState = {
      foo: 'bar',
      bar: 'foo',
      baz: -1,
    };

    rootReducer = (state = defaultState, action) => {
      switch (action.type) {
        case 'UPDATE_FOO':
          return Object.assign({}, state, { foo: action.payload });
        case 'UPDATE_BAZ':
          return Object.assign({}, state, { baz: action.payload });
        case 'UPDATE_BAR':
          return Object.assign({}, state, { bar: action.payload });
        default:
          return state;
      }
    };

    mockAppRef = {
      tick: sinon.spy()
    };

    ngRedux = new NgRedux<IAppState>(mockAppRef);
    ngRedux.configureStore(rootReducer, defaultState);
  });

  it('should throw when the store is configured twice', () => {
    // Configured once in beforeEach, now we try to configure
    // it a second time.
    expect(ngRedux.configureStore.bind(ngRedux, rootReducer, defaultState))
      .to.throw(Error);
  });

  it('should get the initial state', (done) => {
    let state$ = ngRedux
      .select(state => state)
      .subscribe(state => {
        expect(state.foo).to.equal('bar');
        expect(state.baz).to.equal(-1);
        done();
      });
  });

  it('should accept a keyname for a selector', (done) => {
    let foo$ = ngRedux
      .select('foo')
      .subscribe(stateSlice => {
        expect(stateSlice).to.equal('bar');
        done();
      });
  });

  it('should not trigger a selector if that slice of state was not changed',
    (): void => {
      let fooData;

      let spy = sinon.spy((foo) => { fooData = foo; });

      let foo$ = ngRedux
        .select('foo')
        .subscribe(spy);

      ngRedux.dispatch({ type: 'UPDATE_BAR', payload: 0 });

      expect(spy).to.have.been.calledOnce;

      expect(fooData).to.equal('bar');
      ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'changeFoo' });
      expect(spy).to.have.been.calledTwice;
      expect(fooData).to.equal('changeFoo');
      foo$.unsubscribe();
    });

  it('should not trigger a selector if the action payload is the same',
    (): void => {
      let fooData;
      let spy = sinon.spy((foo) => { fooData = foo; });
      let foo$ = ngRedux
        .select('foo')
        .subscribe(spy);

      expect(spy).to.have.been.calledOnce;
      expect(fooData).to.equal('bar');

      ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'bar' });
      expect(spy).to.have.been.calledOnce;
      expect(fooData).to.equal('bar');
      foo$.unsubscribe();
    });

  it('should not call the sub if the result of the function is the same',
    () => {
      let fooData;
      let spy = sinon.spy((foo) => { fooData = foo; });
      let foo$ = ngRedux
        .select(state => `${state.foo}-${state.baz}`)
        .subscribe(spy);

      expect(spy).to.have.been.calledOnce;
      expect(fooData).to.equal('bar--1');

      expect(spy).to.have.been.calledOnce;
      expect(fooData).to.equal('bar--1');

      ngRedux.dispatch({ type: 'UPDATE_BAR', payload: 'bar' });
      expect(spy).to.have.been.calledOnce;
      expect(fooData).to.equal('bar--1');

      ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'update' });
      expect(fooData).to.equal('update--1');
      expect(spy).to.have.been.calledTwice;

      ngRedux.dispatch({ type: 'UPDATE_BAZ', payload: 2 });
      expect(fooData).to.equal('update-2');
      expect(spy).to.have.been.calledThrice;
    });

  it(`should accept a custom compare function`, () => {
    let fooData;
    let spy = sinon.spy((foo) => { fooData = foo; });
    let cmp = (a, b) => a.data === b.data;

    let foo$ = ngRedux
      .select(state => ({ data: `${state.foo}-${state.baz}` }), cmp)
      .subscribe(spy);

    expect(spy).to.have.been.calledOnce;
    expect(fooData.data).to.equal('bar--1');

    ngRedux.dispatch({ type: 'UPDATE_BAR', payload: 'bar' });
    expect(spy).to.have.been.calledOnce;
    expect(fooData.data).to.equal('bar--1');

    ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'update' });
    expect(fooData.data).to.equal('update--1');
    expect(spy).to.have.been.calledTwice;

    ngRedux.dispatch({ type: 'UPDATE_BAZ', payload: 2 });
    expect(fooData.data).to.equal('update-2');
    expect(spy).to.have.been.calledThrice;
  });

  it('should force the Angular UI to update when a change is made externally',
    () => {
      ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'update' });
      expect(mockAppRef.tick).to.have.been.calledOnce;
    });

});

