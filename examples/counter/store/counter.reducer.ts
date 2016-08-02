import { CounterActions } from '../actions/counter.actions';

const INITIAL_STATE: number = 0;

export function counterReducer(state: number = INITIAL_STATE, action:any) {
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
