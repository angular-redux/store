import {bootstrap} from 'angular2/angular2';
import {bind} from 'angular2/di';
import {createStore, applyMiddleware} from 'redux';
const thunk = require('redux-thunk');
import App from './containers/App';
const provider = require('ng2-redux').provider;
import rootReducer from './reducers/index';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

bootstrap(
  App,
  [provider(store)]
  );
