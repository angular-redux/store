import { NgModule, NgZone } from '@angular/core';
import { NgRedux } from './components/ng-redux';
import { RootStore } from './components/root-store';
import { DevToolsExtension } from './components/dev-tools';

/** @hidden */
export function _ngReduxFactory(ngZone: NgZone) {
  return new RootStore(ngZone);
}

@NgModule({
  providers: [
    DevToolsExtension,
    { provide: NgRedux, useFactory: _ngReduxFactory, deps: [NgZone] },
  ],
})
export class NgReduxModule {}
