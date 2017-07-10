import {
  Selector,
  Comparator,
  ObservableStore,
  PathSelector,
} from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Reducer, Dispatch } from 'redux';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/distinctUntilChanged';

/** @hidden */
export interface SelectorStubRecord {
  subject: Subject<any>;
  comparator: Comparator;
}

/** @hidden */
export interface SelectorStubMap {
  [selector: string]: SelectorStubRecord;
}

/** @hidden */
export interface SubStoreStubMap {
  [basePath: string]: MockObservableStore<any>
}

/** @hidden */
export class MockObservableStore<State> implements ObservableStore<any> {
  selections: SelectorStubMap = {};
  subStores: SubStoreStubMap = {};

  getSelectorStub = <SelectedState>(
    selector?: Selector<State, SelectedState>,
    comparator?: Comparator): Subject<SelectedState> =>
      this.initSelectorStub<SelectedState>(selector, comparator).subject;

  reset = () => {
    Object.keys(this.subStores).forEach(k => this.subStores[k].reset());
    this.selections = {};
    this.subStores = {};
  }

  dispatch: Dispatch<State> = action => action;
  replaceReducer = () => null;
  getState = () => ({} as State);
  subscribe = () => () => null;

  select = <SelectedState>(
    selector?: Selector<any, SelectedState>,
    comparator?: Comparator): Observable<any> => {
      const stub = this.initSelectorStub<SelectedState>(selector, comparator);
      return stub.comparator ?
        stub.subject.distinctUntilChanged(stub.comparator) :
        stub.subject;
    }

  configureSubStore = <SubState>(
    basePath: PathSelector,
    _: Reducer<SubState>): MockObservableStore<SubState> =>
      this.initSubStore<SubState>(basePath)

  getSubStore = <SubState>(...pathSelectors: PathSelector[]): MockObservableStore<any> => {
    const [ first, ...rest ] = pathSelectors;
    return (first ?
      this.initSubStore(first).getSubStore(...rest) :
      this) as MockObservableStore<SubState>;
  }

  private initSubStore<SubState>(basePath: PathSelector) {
    const result = this.subStores[JSON.stringify(basePath)] ||
      new MockObservableStore<SubState>();
    this.subStores[JSON.stringify(basePath)] = result;
    return result;
  }

  private initSelectorStub<SelectedState>(
    selector?: Selector<State, SelectedState>,
    comparator?: Comparator): SelectorStubRecord {

    const key = selector ? selector.toString() : '';
    const record = this.selections[key] || {
      subject: new ReplaySubject<SelectedState>(),
      comparator,
    };

    this.selections[key] = record;
    return record;
  }
}
