import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgRedux } from './components/ng-redux';
@NgModule({
  
})
export class NgReduxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgReduxModule,
      providers: [NgRedux]
    };
  }
};
