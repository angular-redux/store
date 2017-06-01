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
import { select, select$ } from './decorators/select';
import { dispatch } from './decorators/dispatch';
import { NgReduxModule } from './ng-redux.module';
import { selectionMap } from './utils/selection-map';

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
  Transformer,
  NgReduxModule,
  DevToolsExtension,
  select,
  select$,
  dispatch,
  ObservableStore,
  selectionMap,
};
