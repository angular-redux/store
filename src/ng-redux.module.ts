import { NgModule, NgZone } from '@angular/core';
import { NgRedux } from './components/ng-redux';
import { DevToolsExtension } from './components/dev-tools';

export function _ngReduxFactory(ngZone: NgZone) {
  return new NgRedux(ngZone);
}

@NgModule({
  providers: [
    DevToolsExtension,
    { provide: NgRedux, useFactory: _ngReduxFactory, deps: [ NgZone ] }
  ]
})
export class NgReduxModule { };
