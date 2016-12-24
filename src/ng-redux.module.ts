import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgRedux } from './components/ng-redux';
import { DevToolsExtension } from './components/dev-tools';

@NgModule({})
export class NgReduxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgReduxModule,
      providers: provideRedux(),
    };
  }
};

export function _ngReduxFactory() {
  return new NgRedux(null);
}

export function provideRedux(): any[] {
  return [
    { provide: NgRedux, useFactory: _ngReduxFactory },
    DevToolsExtension,
  ];
}
