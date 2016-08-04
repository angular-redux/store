import { Injectable, ApplicationRef } from '@angular/core';

declare const window: any;
const environment: any = window || this;

/**
 * An angular-2-ified version of the Redux DevTools chrome extension.
 */
@Injectable()
export class DevToolsExtension {
  constructor(private appRef: ApplicationRef) {}

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
    if (!this.isEnabled()) {
      return null;
    }

    // Make sure changes from dev tools update angular's view.
    environment.devToolsExtension.listen(() => this.appRef.tick());
    return environment.devToolsExtension(options);
  }

  /**
   * Returns true if the extension is installed and enabled.
   */
  isEnabled() {
    return environment && environment.devToolsExtension;
  }
}
