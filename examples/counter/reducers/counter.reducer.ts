import { CounterActions } from '../actions/counter.actions';

export default (state: number = 0, action:any) => {
  switch (action.type) {
    case CounterActions.INCREMENT_COUNTER:
      return state + 1;
    case CounterActions.DECREMENT_COUNTER:
      return state - 1;
    case CounterActions.RANDOMIZE_COUNTER:
      return action.payload;
    default:
      return state;
  }
}
