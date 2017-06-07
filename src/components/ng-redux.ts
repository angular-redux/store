import {
  Store,
  Action,
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
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Selector, PathSelector, Comparator, resolveToFunctionSelector } from './selectors';
import { assert } from '../utils/assert';
import { SubStore } from './sub-store';
import { enableFractalReducers } from './fractal-reducer-map';
import { ObservableStore } from './observable-store';

export class NgRedux<RootState> implements ObservableStore<RootState> {
  /** @hidden */
  static instance?: ObservableStore<any> = undefined;

  private _store: Store<RootState>;
  private _store$: BehaviorSubject<RootState>;

  /** @hidden */
  constructor(private ngZone: NgZone) {
    NgRedux.instance = this;
    this._store$ = new BehaviorSubject<RootState | undefined>(undefined)
      .filter(n => n !== undefined)
      .switchMap(n => this.storeToObservable(n as any)) as BehaviorSubject<RootState>;
  }

  /**
   * Configures a Redux store and allows NgRedux to observe and dispatch
   * to it.
   *
   * This should only be called once for the lifetime of your app, for
   * example in the constructor of your root component.
   *
   * @param rootReducer Your app's root reducer
   * @param initState Your app's initial state
   * @param middleware Optional Redux middlewares
   * @param enhancers Optional Redux store enhancers
   */
  configureStore(
    rootReducer: Reducer<RootState>,
    initState: RootState,
    middleware: Middleware[] = [],
    enhancers: StoreEnhancer<RootState>[] = []): void {
    assert(!this._store, 'Store already configured!');

    // Variable-arity compose in typescript FTW.
    this.setStore(
      compose.apply(null,
        [ applyMiddleware(...middleware), ...enhancers ])(createStore)
        (enableFractalReducers(rootReducer), initState));
  }

  /**
   * Accepts a Redux store, then sets it in NgRedux and
   * allows NgRedux to observe and dispatch to it.
   *
   * This should only be called once for the lifetime of your app, for
   * example in the constructor of your root component. If configureStore
   * has been used this cannot be used.
   *
   * @param store Your app's store
   */
  provideStore(store: Store<RootState>) {
    assert(!this._store, 'Store already configured!');
    this.setStore(store);
  };

  // Redux Store methods.

  getState = (): RootState =>
    this._store.getState()

  subscribe = (listener: () => void): Unsubscribe =>
    this._store.subscribe(listener)

  replaceReducer = (nextReducer: Reducer<RootState>) =>
    this._store.replaceReducer(nextReducer)

  dispatch: Dispatch<RootState> = action => {
    assert(
      !!this._store,
      'Dispatch failed: did you forget to configure your store? ' +
        'https://github.com/angular-redux/@angular-redux/core/blob/master/' +
        'README.md#quick-start');

    return this.ngZone.run(() => this._store.dispatch(action));
  };

  // ObservableStore methods

  select = <S>(
    selector?: Selector<RootState, S>,
    comparator?: Comparator): Observable<S> =>
      this._store$
        .distinctUntilChanged()
        .map(resolveToFunctionSelector(selector))
        .distinctUntilChanged(comparator);

  configureSubStore = <SubState>(
    basePath: PathSelector,
    localReducer: Reducer<SubState>): ObservableStore<SubState> =>
      new SubStore<SubState>(this, basePath, localReducer)

  private setStore(store: Store<RootState>) {
    this._store = store;
    this._store$.next(store as any);
  }

  private storeToObservable = (store: Store<RootState>): Observable<RootState> =>
    new Observable<RootState>(observer => {
      observer.next(store.getState());
      store.subscribe(() => observer.next(store.getState()));
    });
};
