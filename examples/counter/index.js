import {bootstrap} from 'angular2/angular2';
import {bind} from 'angular2/di';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {App} from './containers/App';
import {ngRedux} from  'ng2-redux';
import {rootReducer} from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

bootstrap(
  App,
  [bind('ngRedux').toFactory(() => {
   	return new ngRedux(store);
   })]
);
