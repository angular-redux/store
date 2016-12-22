import { NgModule } from '@angular/core';
import { NgRedux } from './components/ng-redux';
import { DevToolsExtension } from './components/dev-tools';


export function _ngReduxFactory() {
  return new NgRedux(null);
}

@NgModule({
  providers: [
    DevToolsExtension,
    { provide: NgRedux, useFactory: _ngReduxFactory }
  ]
})
export class NgReduxModule { };
