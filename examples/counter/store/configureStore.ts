import {createStore, applyMiddleware, compose} from 'redux';
const thunk = require('redux-thunk');
import reducer from '../reducers/index';
const devTools = require('redux-devTools').devTools;

const finalCreateStore = compose(
  applyMiddleware(thunk),
  devTools()
)(createStore);

export default () => {
  return finalCreateStore(reducer);
}
