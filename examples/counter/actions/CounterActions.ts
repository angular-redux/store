import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../constants/ActionTypes';

export var increment = () => {
  return {
    type: INCREMENT_COUNTER
  };
}

export var decrement = () => {
  return {
    type: DECREMENT_COUNTER
  };
}

export var incrementIfOdd = () => {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export var incrementAsync = (delay:number = 1000) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}
