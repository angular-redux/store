import {
  NgRedux,
  Selector,
  Comparator,
  ObservableStore,
  PathSelector,
  selectionMap,
} from '@angular-redux/store';
import { Reducer, Action } from 'redux';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/distinctUntilChanged';
import { MockObservableStore } from './observable-store.mock';

/**
 * Convenience mock to make it easier to control selector
 * behaviour in unit tests.
 */
export class MockNgRedux<RootState> extends MockObservableStore<RootState> {
  static mockInstance?: MockNgRedux<any> = undefined;

  /**
   * Returns a subject that's connected to any observable returned by the
   * given selector. You can use this subject to pump values into your
   * components or services under test; when they call .select or @select
   * in the context of a unit test, MockNgRedux will give them the values
   * you pushed onto your stub.
   */
  static getSelectorStub<R, S>(
    selector?: Selector<R, S>,
    comparator?: Comparator): Subject<S> {
      return MockNgRedux.getInstance().getSelectorStub<S>(selector, comparator);
    }

  /**
   * Returns a mock substore that allows you to set up selectorStubs for
   * any 'fractal' stores your app creates with NgRedux.configureSubStore.
   *
   * If your app creates deeply nested substores from other substores,
   * pass the chain of pathSelectors in as ordered arguments to mock
   * the nested substores out.
   * @param pathSelectors
   */
  static getSubStore<S>(...pathSelectors: PathSelector[]): MockObservableStore<S> {
    return pathSelectors.length ?
      MockNgRedux.getInstance().getSubStore(...pathSelectors) :
      MockNgRedux.getInstance();
  }

  /**
   * Reset all previously configured stubs.
   */
  static reset(): void {
    MockNgRedux.getInstance().reset();
    selectionMap.reset();
    NgRedux.instance = MockNgRedux.mockInstance;
  }

  /** @hidden */
  constructor() {
    super();

    NgRedux.instance = this; // This hooks the mock up to @select.
  }

  private static getInstance() {
    if (!MockNgRedux.mockInstance) {
      MockNgRedux.mockInstance = new MockNgRedux();
    }
    return MockNgRedux.mockInstance;
  }
}
