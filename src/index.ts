import { NgRedux } from './components/ng-redux';
import {
  Selector,
  PathSelector,
  PropertySelector,
  FunctionSelector,
  Comparator,
  Transformer,
} from './components/selectors';
import { ObservableStore } from './components/observable-store';
import { DevToolsExtension } from './components/dev-tools';
import { enableFractalReducers } from './components/fractal-reducer-map';
import { select, select$ } from './decorators/select';
import { dispatch } from './decorators/dispatch';
import { WithSubStore } from './decorators/with-sub-store';
import { NgReduxModule } from './ng-redux.module';

// Warning: don't do this:
//  export * from './foo'
// ... because it breaks rollup. See
// tslint:disable-next-line:max-line-length
// https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
export {
  NgRedux,
  Selector,
  PathSelector,
  PropertySelector,
  FunctionSelector,
  Comparator,
  Transformer,
  NgReduxModule,
  DevToolsExtension,
  enableFractalReducers,
  select,
  select$,
  dispatch,
  WithSubStore,
  ObservableStore,
};
