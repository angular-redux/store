import { NgReduxTestingModule } from './ng-redux-testing.module';
import { MockDevToolsExtension } from './dev-tools.mock';
import { MockNgRedux } from './ng-redux.mock';
import { MockObservableStore } from './observable-store.mock';

// Warning: don't do this:
//  export * from './foo'
// ... because it breaks rollup. See
// https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
export {
  NgReduxTestingModule,
  MockDevToolsExtension,
  MockNgRedux,
  MockObservableStore,
};
