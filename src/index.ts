import {
  NgRedux,
  Selector,
  PathSelector,
  PropertySelector,
  FunctionSelector,
  Comparator,
} from './components/ng-redux';
import { DevToolsExtension } from './components/dev-tools';
import { select } from './decorators/select';
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
};
