import Connector from './connector';
import {bind} from 'angular2/di';

export default function createRedux(store) {
  const _connector = new Connector(store);

  return bind('ngRedux').toFactory(() => {
    return {connect: _connector.connect, ...store};
  });
}


