import { Injectable, ApplicationRef } from '@angular/core';
import { NgRedux } from './ng-redux';
import { NgZone } from '@angular/core';
declare const window: any;
const environment: any = typeof window !== 'undefined' ? window : this;

/**
 * An angular-2-ified version of the Redux DevTools chrome extension.
 */
@Injectable()
export class DevToolsExtension {
  constructor(private appRef: ApplicationRef,
    private ngRedux: NgRedux<any>) { }

  /**
   * A wrapper for the Chrome Extension Redux DevTools.
   * Makes sure state changes triggered by the extension
   * trigger Angular2's change detector.
   *
   * @argument { Object } options: dev tool options; same
   * format as described here: 
   * [zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md]
   */
  enhancer = (options?: Object) => {
    let subscription;
    if (!this.isEnabled()) {
      return null;
    }

    // Make sure changes from dev tools update angular's view.
    environment.devToolsExtension.listen(({type}) => {
      if (type === 'START') {
        subscription = this.ngRedux.subscribe(() => {
          if (!NgZone.isInAngularZone()) {
            this.appRef.tick();
          }
        });
      } else if (type === 'STOP') {
        subscription();
      }
    });

    return environment.devToolsExtension(options);
  }

  /**
   * Returns true if the extension is installed and enabled.
   */
  isEnabled() {
    return environment && environment.devToolsExtension;
  }
}
