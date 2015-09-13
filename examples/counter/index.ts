import {bootstrap} from 'angular2/angular2';
import {bind} from 'angular2/di';
import App from './containers/App';
import configureStore from './store/configureStore';
const provider = require('ng2-redux').provider;

const store = configureStore();

bootstrap(
  App,
  [provider(store)]
  );
