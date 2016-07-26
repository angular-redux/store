import { CounterActions } from '../actions/counter.actions';

export default (state: any = {
  foo: {
    bar: [ 0 ]
  }
}, action:any) => {
  switch (action.type) {
    case CounterActions.INCREMENT_COUNTER:
      return { foo: { bar: [ state.foo.bar[0] + 1 ] } };
    case CounterActions.DECREMENT_COUNTER:
      return { foo: { bar: [ state.foo.bar[0] - 1 ] } };
    default:
      return state;
  }
}
