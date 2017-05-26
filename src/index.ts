import { NgRedux } from './components/ng-redux';
import {
  Selector,
  PathSelector,
  PropertySelector,
  FunctionSelector,
} from './components/selectors';
import { ObservableStore, Comparator } from './components/observable-store';
import { DevToolsExtension } from './components/dev-tools';
import { select, select$ } from './decorators/select';
import { dispatch } from './decorators/dispatch';
import { NgReduxModule } from './ng-redux.module';

// Warning: don't do this:
//  export * from './foo'
// ... because it breaks rollup. See
// https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
export {
  NgRedux,
  Selector,
  PathSelector,
  PropertySelector,
  FunctionSelector,
  Comparator,
  NgReduxModule,
  DevToolsExtension,
  select,
  select$,
  dispatch,
  ObservableStore,
};
