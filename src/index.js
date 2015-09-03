import Connector from './connector';
import {bind, Injector} from 'angular2/di';
let redux = import('redux');

export function createRedux(store) {
  const _connector = new Connector(store);

  return bind('ngRedux').toFactory(() => {
    return {connect: _connector.connect, ...store};
  });
}


/*
 const createStoreWithMiddleware = applyInjectableMiddleware(thunk, 'promise')(createStore);
*/
    
export function applyInjectableMiddleware(middlewares) {
    const injector = new Injector();
    let resolvedMiddlewares = [];
    _.forEach(middlewares, middleware => { 
        _.isString(middleware) 
            ? resolvedMiddlewares.push(Injector.resolve(middleware)) 
            : resolvedMiddlewares.push(middleware)
    });
    
    return redux.applyMiddleware(...resolvedMiddlewares);
}



