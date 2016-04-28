import {bootstrap} from 'angular2/platform/browser';
import {App} from './containers/App';
import configureStore from './store/configureStore';
import {provider} from 'ng2-redux';

const store = configureStore();

bootstrap(App, [ provider(store) ]);
