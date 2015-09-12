import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../constants/ActionTypes';

export default (state:number, action:any) => {
  // to avoid tsc error  "A required parameter cannot follow an optional
  // parameter. (1016)" set default value of state here
  state = (state || 0);
  
  switch (action.type) {
  case INCREMENT_COUNTER:
    return state + 1;
  case DECREMENT_COUNTER:
    return state - 1;
  default:
    return state;
  }
}
