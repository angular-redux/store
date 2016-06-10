import * as Redux from 'redux';
const {createStore, applyMiddleware, compose} = Redux;
const thunk = require('redux-thunk').default;
import reducer from '../reducers/index';

const enhancers = [];

if (window.devToolsExtension) {
  enhancers.push(window.devToolsExtension());
}

export interface RootState {
  counter: number;
}

const finalCreateStore = <Redux.StoreEnhancerStoreCreator<RootState>>compose(
  applyMiddleware(thunk),
  ...enhancers
)(createStore);

export default () => {
  return finalCreateStore(reducer, {counter:0} as RootState);
}