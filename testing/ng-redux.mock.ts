import {
  NgRedux,
  Selector,
  Comparator,
} from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import 'rxjs/add/observable/from';
import 'rxjs/add/operator/distinctUntilChanged';

interface SelectorStubRecord {
  subject: Subject<any>;
  comparator: Comparator;
}

interface SelectorStubMap {
  [selector: string]: SelectorStubRecord;
}

/**
 * Convenience mock to make it easier to control selector
 * behaviour in unit tests.
 */
export class MockNgRedux<RootState> extends NgRedux<RootState> {
  public static mockInstance: MockNgRedux<any> = null;
  private static selections: SelectorStubMap = {};

  /**
   * Returns a subject that's connected to any observable returned by the
   * given selector. You can use this subject to pump values into your
   * components or services under test; when they call .select or @select
   * in the context of a unit test, MockNgRedux will give them the values
   * you pushed onto your stub.
   */
  public static getSelectorStub<R, S>(
    selector?: Selector<R, S>,
    comparator?: Comparator): Subject<S> {
    return MockNgRedux.initSelectorStub<R, S>(selector, comparator).subject;
  }

  /**
   * Reset all previously configured stubs.
   */
  public static reset(): void {
    MockNgRedux.selections = {};
  }

  private static initSelectorStub<R, S>(
    selector?: Selector<R, S>,
    comparator?: Comparator): SelectorStubRecord {

    const key = selector.toString();
    const record = MockNgRedux.selections[key] || {
      subject: new ReplaySubject<S>(),
      comparator,
    };

    MockNgRedux.selections[key] = record;
    return record;
  }

  /** @hidden */
  constructor() {
    super(null);

    NgRedux.instance = this; // This hooks the mock up to @select.
    MockNgRedux.mockInstance = this;
  }

  public dispatch = () => null;

  public select<S>(selector?: Selector<RootState, S>, comparator?: Comparator): Observable<any> {
    const stub = MockNgRedux.initSelectorStub<RootState, S>(selector, comparator);
    return stub.comparator ?
      stub.subject.distinctUntilChanged(stub.comparator) :
      stub.subject;
  }
}
