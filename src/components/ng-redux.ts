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
import { Selector, resolveToFunctionSelector } from './selectors';
import { assert } from '../utils/assert';

export type Comparator = (x: any, y: any) => boolean;

export class NgRedux<RootState> {
  /** @hidden */
  static instance: NgRedux<any> = undefined;

  private _store: Store<RootState> = null;
  private _store$: BehaviorSubject<RootState> = null;

  /** @hidden */
  constructor(private ngZone: NgZone) {
    NgRedux.instance = this;
    this._store$ = new BehaviorSubject<RootState>(undefined)
      .filter(n => n !== undefined)
      .switchMap(n => this.storeToObservable(n as any)) as BehaviorSubject<RootState>;
  }

  /**
   * configures a Redux store and allows NgRedux to observe and dispatch
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
        (rootReducer, initState));
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

  /**
   * Select a slice of state to expose as an observable.
   *
   * @typeparam S
   * @param selector key or function to select a part of the state
   * @param [comparator] Optional
   * comparison function called to test if an item is distinct
   * from the previous item in the source.
   *
   * @returns An Observable that emits items from the
   * source Observable with distinct values.
   */
  select = <S>(
    selector?: Selector<RootState, S>,
    comparator?: Comparator): Observable<S> =>
      this._store$
        .distinctUntilChanged()
        .map(resolveToFunctionSelector(selector))
        .distinctUntilChanged(comparator);

  /**
   * Get the current state of the application
   * @returns The application state
   */
  getState = (): RootState => this._store.getState()

  /**
   * Subscribe to the Redux store changes
   *
   * @param listener A callback to invoke when the state is updated
   * @returns A function to unsubscribe
   */
  subscribe = (listener: () => void): Unsubscribe =>
    this._store.subscribe(listener)

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param nextReducer The reducer for the store to use instead.
   */
  replaceReducer = (nextReducer: Reducer<RootState>) =>
    this._store.replaceReducer(nextReducer)

  /**
   * Dispatch an action to Redux.
   *
   * Ensures that dispatch happens inside the Angular Zone.
   */
  dispatch: Dispatch<RootState> = action => {
    assert(
      !!this._store,
      'Dispatch failed: did you forget to configure your store? ' +
        'https://github.com/angular-redux/@angular-redux/core/blob/master/' +
        'README.md#quick-start');

    return this.ngZone.run(() => this._store.dispatch(action));
  };

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
