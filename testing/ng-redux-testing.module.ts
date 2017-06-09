import { NgModule } from '@angular/core';
import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { MockNgRedux } from './ng-redux.mock';
import { MockDevToolsExtension } from './dev-tools.mock';

// Needs to be initialized early so @select's use the mocked version too.
const mockNgRedux = MockNgRedux.getInstance();

/** @hidden */
export function _mockNgReduxFactory() {
  return mockNgRedux;
}

@NgModule({
  imports: [],
  providers: [
    { provide: NgRedux, useFactory: _mockNgReduxFactory },
    { provide: DevToolsExtension, useClass: MockDevToolsExtension },
  ],
})
export class NgReduxTestingModule {}
