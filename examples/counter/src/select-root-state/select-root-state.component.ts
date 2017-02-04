import { Component } from '@angular/core';
import { NgRedux, select } from '@angular-redux/core';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../store';

@Component({
  selector: 'select-root-state',
  templateUrl: './select-root-state.component.html',
})
export class SelectRootStateComponent {
  rootState$: Observable<IAppState>;

  constructor(ngRedux: NgRedux<IAppState>) {
    this.rootState$ = ngRedux.select();
  }
}
