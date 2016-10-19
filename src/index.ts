import { NgModule } from '@angular/core';
import { NgRedux } from './components/ng-redux';
import { DevToolsExtension } from './components/dev-tools';
import { select } from './decorators/select';
import { ModuleWithProviders } from '@angular/core';

@NgModule({
  
})
class NgReduxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgReduxModule,
      providers: [NgRedux]
    };
  }
}

export {
  NgReduxModule,
  NgRedux,
  DevToolsExtension,
  select,
}
