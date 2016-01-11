import Connector from './connector';
import {provide, Injector} from 'angular2/core';
let redux = require('redux');

export function provider(store) {
  const _connector = new Connector(store);

  return provide('ngRedux', {useFactory: () => {
    return { connect: _connector.connect, ...store};
  }});
}


/*
 const createStoreWithMiddleware = applyInjectableMiddleware(thunk, 'promise')(createStore);
*/
/*
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
*/
