import {bootstrap} from 'angular2/platform/browser';
import App from './containers/App';
import configureStore from './store/configureStore';
const provider = require('ng2-redux').provider;
const devTools = require('./devTools');
const store = configureStore();

bootstrap(
  App,
  [
    provider(store),
    devTools
  ]
);
