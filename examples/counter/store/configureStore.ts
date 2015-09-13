import {createStore, applyMiddleware} from 'redux';
const thunk = require('redux-thunk');
import reducer from '../reducers/index';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export default () => {
  const store = createStoreWithMiddleware(reducer);

  return store;
}
