import { AnyAction, Dispatch, Reducer } from 'redux';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { getIn } from '../utils/get-in';
import {
  PathSelector,
  Selector,
  Comparator,
  resolveToFunctionSelector,
} from './selectors';
import { NgRedux } from './ng-redux';
import { ObservableStore } from './observable-store';
import {
  registerFractalReducer,
  replaceLocalReducer,
} from './fractal-reducer-map';

/** @hidden */
export class SubStore<State> implements ObservableStore<State> {
  constructor(
    private rootStore: NgRedux<any>,
    private basePath: PathSelector,
    localReducer: Reducer<State, AnyAction>
  ) {
    registerFractalReducer(basePath, localReducer);
  }

  dispatch: Dispatch<AnyAction> = action =>
    this.rootStore.dispatch(
      Object.assign({}, action, {
        '@angular-redux::fractalkey': JSON.stringify(this.basePath),
      })
    );

  getState = (): State => getIn(this.rootStore.getState(), this.basePath);

  configureSubStore = <SubState>(
    basePath: PathSelector,
    localReducer: Reducer<SubState, AnyAction>
  ): ObservableStore<SubState> =>
    new SubStore<SubState>(
      this.rootStore,
      [...this.basePath, ...basePath],
      localReducer
    );

  select = <SelectedState>(
    selector?: Selector<State, SelectedState>,
    comparator?: Comparator
  ): Observable<SelectedState> =>
    this.rootStore
      .select<State>(this.basePath)
      .pipe(
        map(resolveToFunctionSelector(selector)),
        distinctUntilChanged(comparator)
      );

  subscribe = (listener: () => void): (() => void) => {
    const subscription = this.select().subscribe(listener);
    return () => subscription.unsubscribe();
  };

  replaceReducer = (nextLocalReducer: Reducer<State, AnyAction>) =>
    replaceLocalReducer(this.basePath, nextLocalReducer);
}
