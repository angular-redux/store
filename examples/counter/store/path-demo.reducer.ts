import { CounterActions } from '../actions/counter.actions';

export interface IPathDemoData {
  foo: {
    bar: number[];
  };
}

const INITIAL_STATE: IPathDemoData = {
  foo: {
    bar: [ 0 ]
  }
};

export function pathDemoReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CounterActions.INCREMENT_COUNTER:
      return { foo: { bar: [ state.foo.bar[0] + 1 ] } };
    case CounterActions.DECREMENT_COUNTER:
      return { foo: { bar: [ state.foo.bar[0] - 1 ] } };
    default:
      return state;
  }
}
