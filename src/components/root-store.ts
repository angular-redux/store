import {
  Store,
  AnyAction,
  Reducer,
  Middleware,
  StoreEnhancer,
  Unsubscribe,
  createStore,
  applyMiddleware,
  compose,
  Dispatch,
} from 'redux';

import { NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { NgRedux } from './ng-redux';
import {
  Selector,
  PathSelector,
  Comparator,
  resolveToFunctionSelector,
} from './selectors';
import { assert } from '../utils/assert';
import { SubStore } from './sub-store';
import { enableFractalReducers } from './fractal-reducer-map';
import { ObservableStore } from './observable-store';

/** @hidden */
export class RootStore<RootState> extends NgRedux<RootState> {
  private _store: Store<RootState> | undefined = undefined;
  private _store$: BehaviorSubject<RootState>;

  constructor(private ngZone: NgZone) {
    super();

    NgRedux.instance = this;
    this._store$ = new BehaviorSubject<RootState | undefined>(undefined).pipe(
      filter(n => n !== undefined),
      switchMap(observableStore => observableStore as any)
      // TODO: fix this? needing to explicitly cast this is wrong
    ) as BehaviorSubject<RootState>;
  }

  configureStore = (
    rootReducer: Reducer<RootState, AnyAction>,
    initState: RootState,
    middleware: Middleware[] = [],
    enhancers: StoreEnhancer<RootState>[] = []
  ): void => {
    assert(!this._store, 'Store already configured!');

    // Variable-arity compose in typescript FTW.
    this.setStore(
      compose.apply(null, [applyMiddleware(...middleware), ...enhancers])(
        createStore
      )(enableFractalReducers(rootReducer), initState)
    );
  };

  provideStore = (store: Store<RootState>) => {
    assert(!this._store, 'Store already configured!');
    this.setStore(store);
  };

  getState = (): RootState => this._store!.getState();

  subscribe = (listener: () => void): Unsubscribe =>
    this._store!.subscribe(listener);

  replaceReducer = (nextReducer: Reducer<RootState, AnyAction>): void => {
    this._store!.replaceReducer(nextReducer);
  };

  dispatch: Dispatch<AnyAction> = <A extends AnyAction>(action: A): A => {
    assert(
      !!this._store,
      'Dispatch failed: did you forget to configure your store? ' +
        'https://github.com/angular-redux/@angular-redux/core/blob/master/' +
        'README.md#quick-start'
    );

    if (!NgZone.isInAngularZone()) {
      return this.ngZone.run(() => this._store!.dispatch(action));
    } else {
      return this._store!.dispatch(action);
    }
  };

  select = <SelectedType>(
    selector?: Selector<RootState, SelectedType>,
    comparator?: Comparator
  ): Observable<SelectedType> =>
    this._store$.pipe(
      distinctUntilChanged(),
      map(resolveToFunctionSelector(selector)),
      distinctUntilChanged(comparator)
    );

  configureSubStore = <SubState>(
    basePath: PathSelector,
    localReducer: Reducer<SubState, AnyAction>
  ): ObservableStore<SubState> =>
    new SubStore<SubState>(this, basePath, localReducer);

  private setStore(store: Store<RootState>) {
    this._store = store;
    const storeServable = this.storeToObservable(store);
    this._store$.next(storeServable as any);
  }

  private storeToObservable = (
    store: Store<RootState>
  ): Observable<RootState> =>
    new Observable<RootState>((observer: Observer<RootState>) => {
      observer.next(store.getState());
      const unsubscribeFromRedux = store.subscribe(() =>
        observer.next(store.getState())
      );
      return () => {
        unsubscribeFromRedux();
        observer.complete();
      };
    });
}
